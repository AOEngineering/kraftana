import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/adminAuth"
import { createMediaAssetInDb } from "@/lib/db/media"
import {
  getRequiredDb,
  getRequiredMediaBucket,
  getServerEnv,
  logDatabaseWarning,
} from "@/lib/db/d1"
import {
  buildMediaPublicUrl,
  buildMediaStorageKey,
  normalizeUsageType,
  validateUploadFile,
} from "@/lib/media"

export async function POST(request) {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json(
      { error: "Please log in to upload studio photos." },
      { status: 401 }
    )
  }

  try {
    const env = getServerEnv()
    const db = getRequiredDb(env)
    const bucket = getRequiredMediaBucket(env)
    const formData = await request.formData()

    const file = formData.get("file")
    const usageType = normalizeUsageType(formData.get("usageType"))
    const altText = String(formData.get("altText") || "")

    validateUploadFile(file)

    const storageKey = buildMediaStorageKey({
      usageType,
      fileName: file.name,
    })
    const publicUrl = buildMediaPublicUrl(storageKey, env)

    await bucket.put(storageKey, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const asset = await createMediaAssetInDb(db, {
      storageKey,
      publicUrl,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      width: null,
      height: null,
      altText,
      uploadedBy: session.username,
      usageType,
    })

    return NextResponse.json({
      id: asset.id,
      public_url: asset.publicUrl,
      storage_key: asset.storageKey,
      file_name: asset.fileName,
      content_type: asset.contentType,
      size_bytes: asset.sizeBytes,
      alt_text: asset.altText,
      usage_type: asset.usageType,
    })
  } catch (error) {
    logDatabaseWarning("admin-media-upload", error)

    const message =
      error instanceof Error
        ? error.message
        : "The image could not be uploaded right now."

    return NextResponse.json(
      {
        error:
          message.includes("binding") || message.includes("NEXT_PUBLIC_MEDIA_BASE_URL")
            ? message
            : "The image could not be uploaded right now. Please try again.",
      },
      { status: 400 }
    )
  }
}

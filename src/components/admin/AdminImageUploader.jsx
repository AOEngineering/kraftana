"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, ImagePlus, LoaderCircle, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif"

function formatFileSize(value) {
  if (!value) return "0 KB"
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

function defaultAltFromName(fileName) {
  return String(fileName || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
}

export default function AdminImageUploader({
  usageType = "general",
  label = "Upload image",
  description = "Choose a clear photo from your device.",
  multiple = true,
  onUploaded,
}) {
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [altText, setAltText] = useState("")
  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles]
  )

  useEffect(() => {
    return () => {
      for (const preview of previews) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [previews])

  async function handleUpload() {
    if (!selectedFiles.length || isUploading) return

    setError("")
    setIsUploading(true)

    try {
      const uploads = []

      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.set("file", file)
        formData.set("usageType", usageType)
        formData.set("altText", altText.trim() || defaultAltFromName(file.name))

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error || "The image could not be uploaded.")
        }

        uploads.push({
          id: payload.id,
          src: payload.public_url,
          alt: payload.alt_text || defaultAltFromName(file.name),
          storageKey: payload.storage_key,
          fileName: payload.file_name,
          sizeBytes: payload.size_bytes,
          contentType: payload.content_type,
          usageType: payload.usage_type,
        })
      }

      onUploaded?.(uploads)
      setSelectedFiles([])
      setAltText("")
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded."
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-[1.6rem] border border-dashed border-[rgba(145,90,81,0.28)] bg-[rgba(255,252,249,0.86)] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(183,119,109,0.12)] text-[color:var(--primary)]">
              <ImagePlus className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-2xl text-[color:var(--foreground)]">{label}</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-foreground/68">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-5"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              Choose photos
            </Button>
            <Button
              type="button"
              className="h-12 px-5"
              disabled={!selectedFiles.length || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {isUploading ? "Uploading..." : "Upload to studio library"}
            </Button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple={multiple}
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files || [])
            setSelectedFiles(files)
            setError("")
          }}
        />

        <label className="mt-4 grid gap-2 text-sm">
          <span>Alt text to start with</span>
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Describe the piece or photo. You can adjust this after upload."
            className="h-12 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4"
          />
        </label>

        {error ? (
          <p className="mt-3 rounded-[1rem] bg-[rgba(180,90,84,0.12)] px-4 py-3 text-sm text-[rgb(140,62,54)]">
            {error}
          </p>
        ) : null}
      </div>

      {previews.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {previews.map((preview) => (
            <article key={`${preview.name}-${preview.size}`} className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
              <div className="aspect-square overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-[color:var(--foreground)]">{preview.name}</p>
                <p className="mt-1 text-xs text-foreground/58">{formatFileSize(preview.size)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}

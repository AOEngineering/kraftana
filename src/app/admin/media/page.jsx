import {
  deleteMediaAssetRecordAction,
  updateMediaAltTextAction,
} from "@/app/admin/actions"
import MediaLibrary from "@/components/admin/MediaLibrary"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getOptionalMediaBucket, getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchMediaAssetsFromDb } from "@/lib/db/media"
import { getMediaPublicBaseUrl } from "@/lib/media"

export const dynamic = "force-dynamic"

export default async function AdminMediaPage({ searchParams }) {
  await requireAdminSession("/admin/media")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Media" description="Manage uploaded studio photos in one place.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const env = getServerEnv()
  const params = await searchParams
  const usageType = params?.usageType || "all"
  const items = await fetchMediaAssetsFromDb(db, { usageType })
  const uploadsAvailable = Boolean(getOptionalMediaBucket(env) && getMediaPublicBaseUrl(env))

  return (
    <AdminShell
      title="Media"
      description="Upload reusable photos, update alt text, and see which images are already connected to the storefront."
    >
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <form className="flex flex-wrap items-end gap-4">
          <label className="grid gap-2 text-sm">
            <span>Usage</span>
            <select
              name="usageType"
              defaultValue={usageType}
              className="admin-input"
            >
              <option value="all">Everything</option>
              <option value="product">Product photos</option>
              <option value="gallery">Gallery photos</option>
              <option value="general">General uploads</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
          >
            Filter media
          </button>
        </form>
      </section>

      <MediaLibrary
        items={items}
        updateAltAction={updateMediaAltTextAction}
        deleteAction={deleteMediaAssetRecordAction}
        uploadsAvailable={uploadsAvailable}
        setupMessage="The admin design is ready for uploads, but the media bucket and public media URL still need final setup before image uploads are turned on."
      />
    </AdminShell>
  )
}

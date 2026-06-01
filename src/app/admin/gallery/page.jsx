import { saveGalleryItemAction } from "@/app/admin/actions"
import GalleryEditor from "@/components/admin/GalleryEditor"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchGalleryItemsFromDb } from "@/lib/db/gallery"
import { fetchProductsFromDb } from "@/lib/db/products"

export const dynamic = "force-dynamic"

export default async function AdminGalleryPage() {
  await requireAdminSession("/admin/gallery")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell
        title="Gallery"
        description="Manage finished-piece photos and feature the strongest studio imagery."
      >
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const [items, products] = await Promise.all([
    fetchGalleryItemsFromDb(db, { status: "all" }),
    fetchProductsFromDb(db, { status: "all" }),
  ])

  return (
    <AdminShell
      title="Gallery"
      description="Add finished pieces in a simple card flow so gallery management feels closer to posting work than editing rows."
    >
      <GalleryEditor items={items} action={saveGalleryItemAction} productOptions={products} />
    </AdminShell>
  )
}

import { saveGalleryWizardAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import GalleryWizard from "@/components/admin/GalleryWizard"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchProductsFromDb } from "@/lib/db/products"

export const dynamic = "force-dynamic"

export default async function GalleryWizardPage({ searchParams }) {
  await requireAdminSession("/admin/wizard/gallery")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Add Gallery Piece" description="The simple gallery wizard is waiting for D1 setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const products = await fetchProductsFromDb(db, { status: "all" })
  const params = await searchParams

  return (
    <AdminShell
      title="Add Gallery Piece"
      description="A quick gallery flow for sharing finished work without opening the advanced gallery editor."
    >
      <GalleryWizard action={saveGalleryWizardAction} productOptions={products} saved={Boolean(params?.created)} />
    </AdminShell>
  )
}

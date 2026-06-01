import { saveProductAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import ProductEditor from "@/components/admin/ProductEditor"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"

export const dynamic = "force-dynamic"

export default async function AdminNewProductPage() {
  await requireAdminSession("/admin/products/new")
  const setupError = await getAdminSetupError()

  return (
    <AdminShell
      title="Add product"
      description="Create a new piece for the shop with a simple, tablet-friendly studio form."
    >
      {setupError ? (
        <AdminSetupNotice message={setupError} />
      ) : (
        <ProductEditor action={saveProductAction} mode="new" />
      )}
    </AdminShell>
  )
}

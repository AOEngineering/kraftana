import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import ProductWizard from "@/components/admin/ProductWizard"
import { saveProductWizardAction } from "@/app/admin/actions"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchProductByIdFromDb } from "@/lib/db/products"

export const dynamic = "force-dynamic"

export default async function ProductWizardPage({ searchParams }) {
  await requireAdminSession("/admin/wizard/product")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Add Shop Item" description="The simple product wizard is waiting for D1 setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const params = await searchParams
  let successProduct = null
  if (params?.created && params?.productId) {
    const db = getRequiredDb(getServerEnv())
    successProduct = await fetchProductByIdFromDb(db, Number(params.productId))
  }

  return (
    <AdminShell
      title="Add Shop Item"
      description="A simple step-by-step flow for adding a shop piece without digging through the full editor."
    >
      <ProductWizard action={saveProductWizardAction} successProduct={successProduct} />
    </AdminShell>
  )
}

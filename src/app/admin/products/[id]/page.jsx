import { notFound } from "next/navigation"

import { preloadProductForEdit, saveProductAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import ProductEditor from "@/components/admin/ProductEditor"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"

export const dynamic = "force-dynamic"

export default async function AdminEditProductPage({ params, searchParams }) {
  await requireAdminSession(`/admin/products/${params.id}`)
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Edit product" description="Update product details, images, and publishing settings.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const product = await preloadProductForEdit(Number(params.id))
  if (!product) notFound()

  const query = await searchParams

  return (
    <AdminShell title={product.title} description="Update product details, images, and publishing settings.">
      <ProductEditor
        product={product}
        action={saveProductAction}
        mode="edit"
        successState={query?.created ? "created" : query?.saved ? "saved" : ""}
      />
    </AdminShell>
  )
}

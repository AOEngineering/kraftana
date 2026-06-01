import { saveSiteInfoWizardAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import SiteInfoWizard from "@/components/admin/SiteInfoWizard"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchProductsFromDb } from "@/lib/db/products"
import { fetchSiteSettingsFromDb } from "@/lib/db/settings"
import { staticSiteSettings } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function SiteInfoWizardPage({ searchParams }) {
  await requireAdminSession("/admin/wizard/site-info")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Site Info" description="The simple site info wizard is waiting for D1 setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const [dbSettings, products] = await Promise.all([
    fetchSiteSettingsFromDb(db),
    fetchProductsFromDb(db, { status: "all" }),
  ])
  const settings = { ...staticSiteSettings, ...dbSettings }
  const params = await searchParams

  return (
    <AdminShell
      title="Site Info"
      description="Update the public details visitors notice most often without opening the full settings page."
    >
      <SiteInfoWizard
        action={saveSiteInfoWizardAction}
        settings={settings}
        productOptions={products}
        saved={Boolean(params?.saved)}
      />
    </AdminShell>
  )
}

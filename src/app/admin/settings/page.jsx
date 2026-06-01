import { saveSettingsAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchSiteSettingsFromDb } from "@/lib/db/settings"
import { staticSiteSettings } from "@/lib/site"

function SettingsSection({ eyebrow, title, description, children }) {
  return (
    <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-[2rem] leading-none text-[color:var(--foreground)]">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  await requireAdminSession("/admin/settings")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Settings" description="Update simple site settings stored in D1.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const dbSettings = await fetchSiteSettingsFromDb(db)
  const settings = { ...staticSiteSettings, ...dbSettings }

  return (
    <AdminShell
      title="Settings"
      description="Adjust the public details visitors see most often without touching raw values or code."
    >
      <form action={saveSettingsAction} className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <SettingsSection
            eyebrow="Site basics"
            title="General site details"
            description="These basics affect the storefront footer, contact details, and how easy it is for visitors to get in touch."
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Contact email</span>
                <input name="contactEmail" defaultValue={settings.contactEmail} className="admin-input" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Footer note</span>
                <input
                  name="footerNote"
                  defaultValue={settings.footerNote}
                  placeholder="Handmade in small batches."
                  className="admin-input"
                />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection
            eyebrow="Contact and socials"
            title="Social links"
            description="These links help visitors find Kraftana elsewhere after they land on the site."
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Instagram URL</span>
                <input name="instagramUrl" defaultValue={settings.instagramUrl} className="admin-input" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Facebook URL</span>
                <input name="facebookUrl" defaultValue={settings.facebookUrl} className="admin-input" />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection
            eyebrow="Homepage"
            title="Featured shop pieces"
            description="Choose which product links should be highlighted on the homepage. Add one product slug per line."
          >
            <label className="grid gap-2 text-sm">
              <span>Homepage featured product slugs</span>
              <textarea
                name="homepageFeaturedProductSlugs"
                rows={6}
                defaultValue={(settings.homepageFeaturedProductSlugs || []).join("\n")}
                className="admin-textarea"
              />
            </label>
          </SettingsSection>

          <SettingsSection
            eyebrow="Announcement"
            title="Top banner"
            description="Use this when you want to share a short seasonal note, update, or availability message."
          >
            <div className="grid gap-4">
              <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  name="announcementBannerEnabled"
                  defaultChecked={settings.announcementBannerEnabled}
                />
                <span>Show the announcement banner</span>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Announcement text</span>
                <input
                  name="announcementBannerText"
                  defaultValue={settings.announcementBannerText}
                  placeholder="Custom order requests are open for summer."
                  className="admin-input"
                />
              </label>
            </div>
          </SettingsSection>
        </div>

        <SettingsSection
          eyebrow="Custom order messaging"
          title="Shop and custom page notes"
          description="These short messages help explain the current shopping and custom-order experience."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Custom order availability message</span>
              <textarea
                name="customOrderAvailabilityText"
                rows={4}
                defaultValue={settings.customOrderAvailabilityText}
                className="admin-textarea"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Shop intro message</span>
              <textarea
                name="shopIntroText"
                rows={4}
                defaultValue={settings.shopIntroText}
                className="admin-textarea"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-5 text-sm font-semibold text-white"
            >
              Save settings
            </button>
            <p className="self-center text-sm leading-7 text-foreground/56">
              These changes update the public storefront once saved.
            </p>
          </div>
        </SettingsSection>
      </form>
    </AdminShell>
  )
}

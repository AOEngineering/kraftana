import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import {
  fetchAnalyticsOverviewFromDb,
  fetchAnalyticsTableStatusFromDb,
} from "@/lib/db/analytics"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage({ searchParams }) {
  await requireAdminSession("/admin/analytics")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Analytics" description="Traffic and attribution reporting needs D1 setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const params = await searchParams
  const daysParam = Number(params?.days || 30)
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30
  const db = getRequiredDb(getServerEnv())
  const tableStatus = await fetchAnalyticsTableStatusFromDb(db)

  if (!tableStatus.ready) {
    return (
      <AdminShell
        title="Analytics"
        description="Traffic and attribution reporting is available after analytics migrations run."
      >
        <AdminSetupNotice
          message={`Analytics tables are missing (${tableStatus.missing.join(
            ", "
          )}). Run migrations: npm run db:migrate:local and npm run db:migrate:remote.`}
        />
      </AdminShell>
    )
  }

  const analytics = await fetchAnalyticsOverviewFromDb(db, days)

  return (
    <AdminShell
      title="Analytics"
      description="Track visits, referers, channels, and conversion events collected from the storefront."
    >
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <form className="flex flex-wrap items-end gap-4">
          <label className="grid gap-2 text-sm">
            <span>Range</span>
            <select name="days" defaultValue={String(days)} className="admin-input">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="admin-surface rounded-[2rem] p-5 sm:p-6">
          <p className="text-sm text-foreground/58">Visits</p>
          <p className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">{analytics.visits}</p>
        </article>
        <article className="admin-surface rounded-[2rem] p-5 sm:p-6">
          <p className="text-sm text-foreground/58">Sessions</p>
          <p className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">{analytics.sessions}</p>
        </article>
        <article className="admin-surface rounded-[2rem] p-5 sm:p-6">
          <p className="text-sm text-foreground/58">Conversions</p>
          <p className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">{analytics.conversions}</p>
        </article>
        <article className="admin-surface rounded-[2rem] p-5 sm:p-6">
          <p className="text-sm text-foreground/58">Conversion rate</p>
          <p className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">
            {analytics.visits ? `${((analytics.conversions / analytics.visits) * 100).toFixed(1)}%` : "0.0%"}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Top channels</h2>
          <div className="mt-5 grid gap-3">
            {analytics.topChannels.length ? analytics.topChannels.map((item) => (
              <div key={item.channel} className="admin-soft-card flex items-center justify-between rounded-[1.2rem] px-4 py-3 text-sm">
                <span>{item.channel || "unknown"}</span>
                <span className="font-medium text-[color:var(--foreground)]">{item.count}</span>
              </div>
            )) : <div className="admin-empty text-sm text-foreground/64">No tracked channel data yet.</div>}
          </div>
        </article>

        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Top referers</h2>
          <div className="mt-5 grid gap-3">
            {analytics.topReferrers.length ? analytics.topReferrers.map((item) => (
              <div key={item.referrer_host} className="admin-soft-card flex items-center justify-between rounded-[1.2rem] px-4 py-3 text-sm">
                <span>{item.referrer_host}</span>
                <span className="font-medium text-[color:var(--foreground)]">{item.count}</span>
              </div>
            )) : <div className="admin-empty text-sm text-foreground/64">No referer data yet.</div>}
          </div>
        </article>

        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Top pages</h2>
          <div className="mt-5 grid gap-3">
            {analytics.topPages.length ? analytics.topPages.map((item) => (
              <div key={item.path} className="admin-soft-card flex items-center justify-between rounded-[1.2rem] px-4 py-3 text-sm">
                <span>{item.path || "/"}</span>
                <span className="font-medium text-[color:var(--foreground)]">{item.count}</span>
              </div>
            )) : <div className="admin-empty text-sm text-foreground/64">No page data yet.</div>}
          </div>
        </article>
      </section>

      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Recent conversions</h2>
        <div className="mt-5 grid gap-3">
          {analytics.recentConversions.length ? analytics.recentConversions.map((item, index) => (
            <div key={`${item.created_at}-${index}`} className="admin-soft-card rounded-[1.2rem] px-4 py-4 text-sm">
              <div className="font-medium text-[color:var(--foreground)]">{item.conversion_type}</div>
              <div className="mt-1 text-foreground/58">
                {item.source_page || "unknown"} | {item.channel || "direct"} | {item.utm_source || "no utm source"}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/46">{item.created_at}</div>
            </div>
          )) : <div className="admin-empty text-sm text-foreground/64">No conversions tracked yet.</div>}
        </div>
      </section>
    </AdminShell>
  )
}

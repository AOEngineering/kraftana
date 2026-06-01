import Link from "next/link"

import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { fetchRecentAdminAuditLogs } from "@/lib/db/adminAudit"
import { fetchContactMessagesFromDb } from "@/lib/db/contactMessages"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchFeedbackFromDb } from "@/lib/db/feedback"
import { fetchRecentMediaAssetsFromDb } from "@/lib/db/media"
import { fetchProductsFromDb } from "@/lib/db/products"
import { fetchCustomRequestsFromDb } from "@/lib/db/customRequests"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  await requireAdminSession("/admin/dashboard")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Dashboard" description="Protected admin features require D1 and uploads setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const [products, requests, messages, feedback, auditLog, recentUploads] = await Promise.all([
    fetchProductsFromDb(db, { status: "all" }),
    fetchCustomRequestsFromDb(db, { status: "all" }),
    fetchContactMessagesFromDb(db, { status: "all" }),
    fetchFeedbackFromDb(db, { status: "all" }),
    fetchRecentAdminAuditLogs(db),
    fetchRecentMediaAssetsFromDb(db),
  ])

  const statusCards = [
    { label: "Visible products", value: products.filter((product) => product.status === "active").length },
    { label: "Draft products", value: products.filter((product) => product.status === "draft").length },
    { label: "Featured products", value: products.filter((product) => product.isFeatured).length },
    { label: "New requests", value: requests.filter((request) => request.status === "new").length },
    { label: "Unread messages", value: messages.filter((message) => message.status === "new").length },
    { label: "Recent uploads", value: recentUploads.length },
  ]

  return (
    <AdminShell
      title="Dashboard"
      description="A wider studio overview for Brandon or deeper admin work when you want the fuller picture."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statusCards.map((card) => (
          <article key={card.label} className="admin-surface rounded-[2rem] p-5 sm:p-6">
            <p className="text-sm text-foreground/58">{card.label}</p>
            <p className="mt-3 font-display text-[2.6rem] leading-none text-[color:var(--foreground)]">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Recent requests</h2>
            <Link href="/admin/requests" className="text-sm text-[color:var(--primary)]">
              Open requests
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {requests.length ? requests.slice(0, 6).map((request) => (
              <div key={request.id} className="admin-soft-card rounded-[1.2rem] px-4 py-4 text-sm">
                <div className="font-medium text-[color:var(--foreground)]">{request.requestNumber}</div>
                <div className="mt-1 text-foreground/58">{request.name} | {request.status}</div>
              </div>
            )) : (
              <div className="admin-empty text-sm leading-7 text-foreground/64">
                No custom requests yet.
              </div>
            )}
          </div>
        </article>

        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Recent activity</h2>
            <Link href="/admin/start" className="text-sm text-[color:var(--primary)]">
              Quick actions
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {auditLog.length ? auditLog.slice(0, 8).map((item) => (
              <div key={item.id} className="admin-soft-card rounded-[1.2rem] px-4 py-4 text-sm">
                <div className="font-medium text-[color:var(--foreground)]">{item.summary}</div>
                <div className="mt-1 text-foreground/58">{item.actor_label} | {item.created_at}</div>
              </div>
            )) : (
              <div className="admin-empty text-sm leading-7 text-foreground/64">
                Admin activity will appear here as products, settings, and requests are updated.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">
              Traffic and attribution
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/66">
              See where visitors come from, which pages they land on, and what converts.
            </p>
          </div>
          <Link
            href="/admin/analytics"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
          >
            Open analytics
          </Link>
        </div>
      </section>
    </AdminShell>
  )
}

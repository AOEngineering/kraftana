import Link from "next/link"

import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { fetchContactMessagesFromDb } from "@/lib/db/contactMessages"
import { fetchCustomRequestsFromDb } from "@/lib/db/customRequests"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"

export const dynamic = "force-dynamic"

const startCards = [
  {
    title: "Add something to the shop",
    description: "Add a crochet piece with photos, price, timing, and care notes.",
    href: "/admin/wizard/product",
    action: "Start",
  },
  {
    title: "Add a finished piece to the gallery",
    description: "Share past work, custom pieces, and inspiration photos.",
    href: "/admin/wizard/gallery",
    action: "Start",
  },
  {
    title: "Review custom requests",
    description: "See who reached out and what they want made.",
    href: "/admin/requests",
    action: "Review",
  },
  {
    title: "Read messages",
    description: "Check contact messages and feedback.",
    href: "/admin/messages",
    action: "Open",
  },
  {
    title: "Update site info",
    description: "Change contact info, social links, banner text, and homepage settings.",
    href: "/admin/wizard/site-info",
    action: "Update",
  },
  {
    title: "Check site analytics",
    description: "See visits, top referers, channels, and recent conversions.",
    href: "/admin/analytics",
    action: "Open",
  },
  {
    title: "Preview the website",
    description: "Open the public site like a visitor.",
    href: "/",
    action: "Preview",
  },
]

export default async function AdminStartPage() {
  await requireAdminSession("/admin/start")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Quick Actions" description="Quick actions are waiting for D1 setup.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const [requests, messages] = await Promise.all([
    fetchCustomRequestsFromDb(db, { status: "all" }),
    fetchContactMessagesFromDb(db, { status: "all" }),
  ])

  return (
    <AdminShell
      title="Quick Actions"
      description="Welcome back, Kevonne. Pick one thing to update today and the studio assistant will walk you through it."
    >
      <section className="admin-surface rounded-[2.2rem] p-6 sm:p-8">
        <p className="mt-4 text-sm font-medium text-foreground/64">Welcome back, Kevonne.</p>
        <h2 className="mt-3 font-display text-[2.6rem] leading-none text-[color:var(--foreground)] sm:text-[3rem]">
          What would you like to update today?
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-foreground/66">
          Start with one clear task. You can always return here when you are done.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {startCards.map((card) => (
            <article key={card.title} className="admin-soft-card flex h-full flex-col rounded-[1.7rem] px-5 py-5">
              <h3 className="font-display text-[1.9rem] leading-none text-[color:var(--foreground)]">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-foreground/66">{card.description}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-5 text-sm font-semibold text-white"
              >
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <h3 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">
            What needs attention?
          </h3>
          <div className="mt-5 grid gap-3">
            <div className="admin-soft-card rounded-[1.2rem] px-4 py-4 text-sm text-[color:var(--foreground)]">
              New custom requests: {requests.filter((request) => request.status === "new").length}
            </div>
            <div className="admin-soft-card rounded-[1.2rem] px-4 py-4 text-sm text-[color:var(--foreground)]">
              New messages: {messages.filter((message) => message.status === "new").length}
            </div>
          </div>
        </article>

        <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <h3 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">
            Need a full status overview?
          </h3>
          <p className="mt-3 text-sm leading-7 text-foreground/66">
            Open the dashboard to review requests, messages, product status, and audit activity together.
          </p>
          <Link
            href="/admin/dashboard"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-5 text-sm"
          >
            Open dashboard
          </Link>
        </article>
      </section>
    </AdminShell>
  )
}

import { redirect } from "next/navigation"

import AdminLoginForm from "@/components/admin/AdminLoginForm"
import { getAdminSession, normalizeAdminNextPath } from "@/lib/adminAuth"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage({ searchParams }) {
  const session = await getAdminSession()
  const params = await searchParams
  const nextPath = normalizeAdminNextPath(params?.next)

  if (session) {
    redirect(nextPath)
  }

  return (
    <main className="section-shell py-16 sm:py-20">
      <div className="mx-auto max-w-lg">
        <section className="admin-surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
            Admin login
          </p>
          <h1 className="mt-4 font-display text-4xl text-[color:var(--foreground)]">
            Welcome back, Kevonne.
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/68">
            Sign in to open the studio assistant. You can add shop pieces, update the gallery, review requests, and change site info from one simple workspace.
          </p>

          <AdminLoginForm nextPath={nextPath} />
        </section>
      </div>
    </main>
  )
}

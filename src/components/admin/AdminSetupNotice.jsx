export default function AdminSetupNotice({ message }) {
  return (
    <article className="admin-surface rounded-[2rem] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
        D1 setup required
      </p>
      <h3 className="mt-3 font-display text-3xl text-[color:var(--foreground)]">
        Admin features are waiting for the database.
      </h3>
      <p className="mt-4 text-sm leading-7 text-foreground/68">{message}</p>
      <p className="mt-4 text-sm leading-7 text-foreground/68">
        Public pages still use the static fallback layer, so the site remains safe while D1 is
        being connected.
      </p>
      <p className="mt-5 text-sm text-foreground/58">
        Setup guide: <code>docs/D1_ADMIN_SETUP.md</code>
      </p>
    </article>
  )
}

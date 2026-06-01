import { saveTestimonialAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { fetchTestimonialsFromDb } from "@/lib/db/testimonials"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"

export const dynamic = "force-dynamic"

function TestimonialForm({ item = null }) {
  return (
    <form action={saveTestimonialAction} className="grid gap-3 rounded-[1.5rem] bg-[color:var(--surface-1)] p-4">
      <input type="hidden" name="id" defaultValue={item?.id || ""} />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" defaultValue={item?.name || ""} placeholder="Name" className="h-11 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 text-sm" />
        <input name="location" defaultValue={item?.location || ""} placeholder="Location" className="h-11 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 text-sm" />
        <input name="productContext" defaultValue={item?.productContext || ""} placeholder="Product context" className="h-11 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 text-sm" />
        <input name="rating" type="number" min="1" max="5" defaultValue={item?.rating || 5} className="h-11 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 text-sm" />
        <input name="sortOrder" type="number" defaultValue={item?.sortOrder || 0} placeholder="Sort order" className="h-11 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 text-sm" />
      </div>
      <textarea name="quote" rows={4} defaultValue={item?.quote || ""} placeholder="Quote" className="rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3 py-3 text-sm" />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="isApproved" defaultChecked={item?.isApproved} /> Approved</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={item?.isFeatured} /> Featured</label>
      </div>
      <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-4 text-sm font-semibold text-white">
        {item ? "Save testimonial" : "Create testimonial"}
      </button>
    </form>
  )
}

export default async function AdminTestimonialsPage() {
  await requireAdminSession("/admin/testimonials")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Testimonials" description="Approve and feature real feedback.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const items = await fetchTestimonialsFromDb(db, { approvedOnly: false })

  return (
    <AdminShell title="Testimonials" description="Approve and feature real feedback.">
      <section className="grid gap-4">
        {items.map((item) => (
          <TestimonialForm key={item.id} item={item} />
        ))}
      </section>
      <section className="paper-panel rounded-[2rem] p-6 sm:p-7">
        <h2 className="font-display text-3xl text-[color:var(--foreground)]">New testimonial</h2>
        <div className="mt-5">
          <TestimonialForm />
        </div>
      </section>
    </AdminShell>
  )
}

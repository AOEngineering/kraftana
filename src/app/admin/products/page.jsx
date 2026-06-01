import Link from "next/link"

import { archiveProductAction, toggleFeaturedProductAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchProductsFromDb } from "@/lib/db/products"
import { PRODUCT_CATEGORIES } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage({ searchParams }) {
  await requireAdminSession("/admin/products")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Products" description="Manage products with D1-backed edits.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const products = await fetchProductsFromDb(db, { status: "all" })
  const params = await searchParams
  const statusFilter = params?.status || "all"
  const categoryFilter = params?.category || "all"
  const page = Math.max(1, Number(params?.page || 1))
  const pageSize = 12
  const filtered = products.filter((product) => {
    if (statusFilter !== "all" && product.status !== statusFilter) return false
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false
    return true
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function statusClass(value) {
    if (value === "active") return "bg-[rgba(82,146,104,0.18)] text-[rgb(40,102,61)]"
    if (value === "draft") return "bg-[rgba(196,120,74,0.18)] text-[rgb(133,77,45)]"
    return "bg-[rgba(120,120,120,0.14)] text-[rgb(84,84,84)]"
  }

  return (
    <AdminShell
      title="Products"
      description="Create, edit, feature, and hide pieces without wading through database language."
    >
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Show</span>
              <select
                name="status"
                defaultValue={statusFilter}
                className="admin-input"
              >
                <option value="all">Everything</option>
                <option value="active">Visible in shop</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Category</span>
              <select
                name="category"
                defaultValue={categoryFilter}
                className="admin-input"
              >
                {PRODUCT_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-5 text-sm"
            >
              Apply filters
            </button>
          </form>

          <Link
            href="/admin/products/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-5 text-sm font-semibold text-white"
          >
            Add new product
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {paged.length ? paged.map((product) => (
          <article key={product.id} className="admin-surface rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.3rem] bg-[color:var(--surface-3)]">
                  {product.images?.[0]?.src ? (
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <div className="text-xl font-semibold text-[color:var(--foreground)]">{product.title}</div>
                  <div className="mt-1 text-sm text-foreground/58">
                    {product.category} | ${product.price.toFixed(2)} | {product.leadDays} days | <span className={`admin-pill ${statusClass(product.status)}`}>{product.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="admin-pill">{product.isFeatured ? "Featured on homepage" : "Not featured"}</span>
                    <span className="admin-pill">{product.availability || "Availability note missing"}</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/68">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
                >
                  Edit
                </Link>
                <form action={toggleFeaturedProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="current" value={String(product.isFeatured)} />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
                  >
                    {product.isFeatured ? "Remove from homepage" : "Feature on homepage"}
                  </button>
                </form>
                <form action={archiveProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 text-sm text-foreground/70"
                  >
                    Archive
                  </button>
                </form>
              </div>
            </div>
          </article>
        )) : (
          <div className="admin-empty text-sm leading-7 text-foreground/64">
            No products match these filters yet. Try another filter, or add your first piece.
          </div>
        )}
      </section>

      {totalPages > 1 ? (
        <section className="admin-surface rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-foreground/62">
              Page {safePage} of {totalPages}
            </div>
            <div className="flex flex-wrap gap-2">
              {safePage > 1 ? (
                <a
                  href={`/admin/products?status=${encodeURIComponent(statusFilter)}&category=${encodeURIComponent(categoryFilter)}&page=${safePage - 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Previous
                </a>
              ) : null}
              {safePage < totalPages ? (
                <a
                  href={`/admin/products?status=${encodeURIComponent(statusFilter)}&category=${encodeURIComponent(categoryFilter)}&page=${safePage + 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Next
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </AdminShell>
  )
}

"use client"

import { Copy, ImageIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import AdminImageUploader from "@/components/admin/AdminImageUploader"
import { Button } from "@/components/ui/button"

function copyText(value) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return
  navigator.clipboard.writeText(value)
}

export default function MediaLibrary({
  items,
  updateAltAction,
  deleteAction,
  uploadDescription = "Upload a reusable studio image for products, gallery cards, or general site use.",
  uploadsAvailable = true,
  setupMessage = "",
}) {
  const router = useRouter()

  return (
    <div className="grid gap-6">
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          Studio uploads
        </p>
        <h2 className="mt-2 font-display text-[2rem] leading-none text-[color:var(--foreground)]">
          Add to the media library
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">{uploadDescription}</p>
        <div className="mt-5">
          {uploadsAvailable ? (
            <AdminImageUploader
              usageType="general"
              label="Upload a general image"
              description="This is useful for future homepage, gallery, or testimonial imagery."
              onUploaded={() => router.refresh()}
            />
          ) : (
            <div className="admin-empty text-sm leading-7 text-foreground/64">
              <div className="font-medium text-[color:var(--foreground)]">Image uploads are not fully configured yet.</div>
              <div className="mt-2">
                {setupMessage || "The media library is ready, but uploads will stay paused until the media bucket and public media URL are confirmed."}
              </div>
            </div>
          )}
        </div>
      </section>

      {items.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="admin-surface rounded-[2rem] p-4 sm:p-5">
              <div className="aspect-square overflow-hidden rounded-[1.4rem] bg-[color:var(--surface-3)]">
                <img src={item.publicUrl} alt={item.altText || item.fileName} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-[color:var(--foreground)]">{item.fileName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/50">
                    {item.usageType}
                  </p>
                </div>
                <div className="admin-pill">
                  <ImageIcon className="mr-2 h-3.5 w-3.5" />
                  {(item.sizeBytes / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>

              <form action={updateAltAction} className="mt-4 grid gap-3">
                <input type="hidden" name="id" value={item.id} />
                <label className="grid gap-2 text-sm">
                  <span>Alt text</span>
                  <input
                    name="altText"
                    defaultValue={item.altText}
                    className="admin-input"
                  />
                </label>
                <Button type="submit" variant="outline" className="h-11">
                  Save alt text
                </Button>
              </form>

              <div className="mt-4 rounded-[1.2rem] bg-[color:var(--surface-1)] px-4 py-3 text-sm text-foreground/68">
                <div>Public URL</div>
                <div className="mt-2 break-all text-xs">{item.publicUrl}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="h-11" onClick={() => copyText(item.publicUrl)}>
                  <Copy className="h-4 w-4" />
                  Copy URL
                </Button>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={item.id} />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-11"
                  disabled={Boolean(item.usageSummary?.length)}
                  onClick={(event) => {
                    if (item.usageSummary?.length) return
                    const confirmed = window.confirm(
                      "Remove this upload from the library? The photo file will stay where it is, but this library entry will be removed."
                    )
                    if (!confirmed) {
                      event.preventDefault()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  {item.usageSummary?.length ? "In use" : "Remove record"}
                </Button>
              </form>
              </div>

              <div className="mt-4 text-xs leading-6 text-foreground/58">
                {item.usageSummary?.length ? (
                  <>In use by: {item.usageSummary.map((usage) => usage.label).join(", ")}</>
                ) : (
                  "Not linked to a product or gallery item yet."
                )}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="admin-empty text-sm leading-7 text-foreground/64">
          No uploaded media yet. Once uploads are ready, studio photos will appear here for reuse across products and gallery pieces.
        </div>
      )}
    </div>
  )
}

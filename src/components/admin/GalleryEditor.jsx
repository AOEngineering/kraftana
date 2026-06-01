"use client"

import { useState } from "react"
import { Eye, EyeOff, Star, StarOff } from "lucide-react"

import AdminImageUploader from "@/components/admin/AdminImageUploader"
import { Button } from "@/components/ui/button"

function GalleryCardForm({ item = null, action, productOptions = [] }) {
  const [imageUrl, setImageUrl] = useState(item?.image || "")
  const [altText, setAltText] = useState(item?.alt || "")
  const isExisting = Boolean(item?.id)

  return (
    <form action={action} className="admin-surface grid gap-5 rounded-[2rem] p-5 sm:p-6">
      <input type="hidden" name="id" value={item?.id || ""} />
      <input type="hidden" name="image" value={imageUrl} />

      <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-4">
          <div className="aspect-[4/4.3] overflow-hidden rounded-[1.5rem] bg-[color:var(--surface-3)]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={altText || item?.title || "Gallery image"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-foreground/54">
                Upload a clear finished-piece photo
              </div>
            )}
          </div>
          <AdminImageUploader
            usageType="gallery"
            label={isExisting ? "Replace gallery photo" : "Upload gallery photo"}
            description="Choose one clear photo that represents the finished piece well."
            multiple={false}
            onUploaded={(assets) => {
              const [asset] = assets
              if (!asset) return
              setImageUrl(asset.src)
              setAltText((current) => current || asset.alt || "")
            }}
          />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Title</span>
              <input
                name="title"
                defaultValue={item?.title || ""}
                placeholder="Blue granny square cardigan"
                className="admin-input"
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Link name</span>
              <input
                name="slug"
                defaultValue={item?.slug || ""}
                placeholder="optional-friendly-link"
                className="admin-input"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span>Description</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={item?.description || ""}
              placeholder="A warm sentence or two about the finished piece."
              className="admin-textarea"
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Tag</span>
              <input
                name="tag"
                defaultValue={item?.tag || ""}
                placeholder="Wearable, gifts, custom crochet clothing"
                className="admin-input"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Related product</span>
              <select
                name="relatedProductSlug"
                defaultValue={item?.relatedProductSlug || ""}
                className="admin-input"
              >
                <option value="">None yet</option>
                {productOptions.map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Alt text</span>
              <input
                name="alt"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder="Describe the piece and photo"
                className="admin-input"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Sort order</span>
              <input
                name="sortOrder"
                type="number"
                defaultValue={item?.sortOrder || 0}
                className="admin-input"
              />
            </label>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
              <input type="checkbox" name="isFeatured" defaultChecked={item?.isFeatured} />
              <span>Feature on gallery page</span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Show in gallery</span>
              <select
                name="status"
                defaultValue={item?.status || "active"}
                className="admin-input"
              >
                <option value="active">Show in gallery</option>
                <option value="archived">Hide for now</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {item ? (
              <>
                <span className="admin-pill">
                  {item.isFeatured ? <Star className="mr-2 h-4 w-4" /> : <StarOff className="mr-2 h-4 w-4" />}
                  {item.isFeatured ? "Featured" : "Not featured"}
                </span>
                <span className="admin-pill">
                  {item.status === "active" ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {item.status === "active" ? "Visible" : "Hidden"}
                </span>
              </>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="h-12">
              {isExisting ? "Save gallery item" : "Add gallery item"}
            </Button>
            <p className="self-center text-sm leading-7 text-foreground/56">
              This keeps the gallery visual and simple, even on a tablet.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function GalleryEditor({ items, action, productOptions }) {
  return (
    <div className="grid gap-6">
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          New finished piece
        </p>
        <h2 className="mt-2 font-display text-[2rem] leading-none text-[color:var(--foreground)]">
          Add a gallery photo
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">
          Upload the photo first, add a short description, and choose whether it should be featured.
        </p>
        <div className="mt-5">
          <GalleryCardForm action={action} productOptions={productOptions} />
        </div>
      </section>

      <section className="grid gap-4">
        {items.length ? items.map((item) => (
          <GalleryCardForm
            key={item.id}
            item={item}
            action={action}
            productOptions={productOptions}
          />
        )) : (
          <div className="admin-empty text-sm leading-7 text-foreground/64">
            No gallery pieces yet. Add a finished piece to give visitors more confidence in the studio work.
          </div>
        )}
      </section>
    </div>
  )
}

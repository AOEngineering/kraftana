"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Eye, GripVertical, Star, Trash2 } from "lucide-react"

import AdminImageUploader from "@/components/admin/AdminImageUploader"
import { Button } from "@/components/ui/button"
import { PRODUCT_CATEGORIES } from "@/lib/products"

function normalizeImages(images = []) {
  const initial = images.map((image, index) => ({
    id: image.id || image.mediaAssetId || `image-${index}`,
    src: image.src,
    alt: image.alt || "",
    isPrimary: Boolean(image.isPrimary) || index === 0,
    sortOrder: Number(image.sortOrder ?? index),
  }))

  const primaryIndex = initial.findIndex((image) => image.isPrimary)

  return initial.map((image, index) => ({
    ...image,
    isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex,
    sortOrder: index,
  }))
}

function normalizeImageState(images = []) {
  const primaryIndex = images.findIndex((image) => image.isPrimary)

  return images.map((image, index) => ({
    ...image,
    isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex,
    sortOrder: index,
  }))
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function ProductSection({ eyebrow, title, description, children }) {
  return (
    <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-[2rem] leading-none text-[color:var(--foreground)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function statusLabel(value) {
  switch (value) {
    case "active":
      return "Showing in shop"
    case "archived":
      return "Archived"
    default:
      return "Draft"
  }
}

export default function ProductEditor({
  product = null,
  action,
  mode = "edit",
  successState = "",
}) {
  const [images, setImages] = useState(() => normalizeImages(product?.images || []))
  const [formError, setFormError] = useState("")
  const [title, setTitle] = useState(product?.title || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const previewSlug = slugify(slug || title)
  const previewUrl = previewSlug ? `/shop/${previewSlug}` : null
  const isNew = mode === "new"

  const successMessage = useMemo(() => {
    if (successState === "created") {
      return "Your product was saved. You can view it in the shop, keep polishing details, or add another piece."
    }
    if (successState === "saved") {
      return "Your product changes were saved."
    }
    return ""
  }, [successState])
  const [showSuccessBanner, setShowSuccessBanner] = useState(Boolean(successMessage))

  function updateImage(index, patch) {
    setImages((current) =>
      normalizeImageState(
        current.map((image, currentIndex) =>
          currentIndex === index ? { ...image, ...patch } : image
        )
      )
    )
  }

  function setPrimaryImage(index) {
    setImages((current) =>
      normalizeImageState(
        current.map((image, currentIndex) => ({
          ...image,
          isPrimary: currentIndex === index,
        }))
      )
    )
  }

  function moveImage(index, direction) {
    setImages((current) => {
      const next = [...current]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= current.length) return current
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return normalizeImageState(next)
    })
  }

  function removeImage(index) {
    setImages((current) => normalizeImageState(current.filter((_, i) => i !== index)))
  }

  function handleSubmit(event) {
    if (isNew && images.length === 0) {
      event.preventDefault()
      setFormError("Add at least one photo before saving a new product.")
      return
    }

    setFormError("")
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="grid gap-6">
      <input type="hidden" name="id" value={product?.id || ""} />
      <input
        type="hidden"
        name="imagesJson"
        value={JSON.stringify(
          images.map((image, index) => ({
            src: image.src,
            alt: image.alt,
            isPrimary: image.isPrimary || index === 0,
            sortOrder: index,
          }))
        )}
      />

      {showSuccessBanner && successMessage ? (
        <section className="admin-surface rounded-[2rem] border border-[rgba(145,90,81,0.18)] bg-[rgba(255,250,247,0.92)] p-6 sm:p-7">
          <h3 className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">Saved</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">{successMessage}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {previewUrl ? (
              <Button asChild variant="outline">
                <Link href={previewUrl}>View in shop</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/admin/products/new">Add another product</Link>
            </Button>
            <Button type="button" onClick={() => setShowSuccessBanner(false)}>
              Continue editing
            </Button>
          </div>
        </section>
      ) : null}

      {formError ? (
        <div className="rounded-[1.4rem] bg-[rgba(180,90,84,0.12)] px-5 py-4 text-sm text-[rgb(140,62,54)]">
          {formError}
        </div>
      ) : null}

      {isNew ? (
        <ProductSection
          eyebrow="Quick add"
          title="Start with the essentials"
          description="Begin with the fields Kevonne needs most often. Everything else can be refined once the piece is visible in the editor."
        >
          <div className="grid gap-3 text-sm text-foreground/68 sm:grid-cols-2 xl:grid-cols-3">
            {["Title", "Category", "Price", "Lead time", "One photo", "Short description"].map(
              (item) => (
                <div key={item} className="admin-soft-card rounded-[1.3rem] px-4 py-3.5">
                  {item}
                </div>
              )
            )}
          </div>
        </ProductSection>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="grid gap-6">
          <ProductSection
            eyebrow="1. Product basics"
            title="Name the piece clearly"
            description="Use the title shoppers should see in the shop. If you leave the link name blank, Kraftana will create one from the title."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Title</span>
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="admin-input"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Shop link</span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="optional-friendly-link"
                  className="admin-input"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Category</span>
                <select
                  name="category"
                  defaultValue={product?.category || "tops"}
                  className="admin-input"
                >
                  {PRODUCT_CATEGORIES.filter((item) => item.value !== "all").map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Show in shop</span>
                <select
                  name="status"
                  defaultValue={product?.status || "draft"}
                  className="admin-input"
                >
                  <option value="draft">Keep hidden for now</option>
                  <option value="active">Show in shop</option>
                  <option value="archived">Archive</option>
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
                <span>Feature on homepage</span>
              </label>
              <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  name="isCustomizable"
                  defaultChecked={product?.isCustomizable ?? true}
                />
                <span>Can be customized</span>
              </label>
            </div>
          </ProductSection>

          <ProductSection
            eyebrow="2. Pricing and timing"
            title="Set the basics customers need"
            description="Use simple numbers here. Price is entered in dollars and stored in cents automatically."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm">
                <span>Price in dollars</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price || ""}
                  className="admin-input"
                  required
                />
                <span className="text-xs leading-6 text-foreground/56">
                  Example: enter `72` for $72.00
                </span>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Lead time in days</span>
                <input
                  name="leadDays"
                  type="number"
                  min="0"
                  defaultValue={product?.leadDays || ""}
                  className="admin-input"
                  required
                />
                <span className="text-xs leading-6 text-foreground/56">
                  Use whole days so timelines stay easy to explain.
                </span>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Availability note</span>
                <input
                  name="availability"
                  defaultValue={product?.availability || ""}
                  placeholder="Made to order, ready to ship, limited availability"
                  className="admin-input"
                />
                <span className="text-xs leading-6 text-foreground/56">
                  This appears on the product card and detail page.
                </span>
              </label>
            </div>
          </ProductSection>

          <ProductSection
            eyebrow="3. Description"
            title="Tell people what makes it special"
            description="Keep the short description quick to scan. Use the full description for warmth, styling, and customization context."
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Short description</span>
                <textarea
                  name="shortDescription"
                  rows={3}
                  defaultValue={product?.shortDescription || ""}
                  className="admin-textarea"
                  required={isNew}
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Full description</span>
                <textarea
                  name="description"
                  rows={6}
                  defaultValue={product?.description || ""}
                  className="admin-textarea"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Customization notes</span>
                <textarea
                  name="customizationNotes"
                  rows={4}
                  defaultValue={product?.customizationNotes || ""}
                  className="admin-textarea"
                />
              </label>
            </div>
          </ProductSection>

          <ProductSection
            eyebrow="4. Care and fit"
            title="Share care, fit, and sizing guidance"
            description="This helps buyers feel confident, especially for handmade wearables and custom sizing."
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Care notes</span>
                <textarea
                  name="careNotes"
                  rows={4}
                  defaultValue={product?.careNotes || ""}
                  className="admin-textarea"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Sizing and fit notes</span>
                <textarea
                  name="fitNotes"
                  rows={4}
                  defaultValue={product?.fitNotes || ""}
                  className="admin-textarea"
                />
              </label>
            </div>
          </ProductSection>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-24 xl:self-start">
          <ProductSection
            eyebrow="Photos"
            title="Add studio photos"
            description="Photos sit near the top on tablet and mobile, and stay beside the form on wider screens."
          >
            <AdminImageUploader
              usageType="product"
              label="Upload product photos"
              description="Tap to choose photos from your tablet or drag files in from desktop."
              onUploaded={(uploadedAssets) => {
                setImages((current) => {
                  const next = [...current]

                  for (const asset of uploadedAssets) {
                    next.push({
                      id: asset.id,
                      src: asset.src,
                      alt: asset.alt,
                      isPrimary: next.length === 0,
                      sortOrder: next.length,
                    })
                  }

                  return normalizeImageState(next)
                })
              }}
            />

            {images.length ? (
              <div className="mt-5 grid gap-4">
                {images.map((image, index) => (
                  <article
                    key={`${image.src}-${index}`}
                    className="admin-soft-card rounded-[1.6rem] p-4"
                  >
                    <div className="aspect-[4/4.3] overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                      <img
                        src={image.src}
                        alt={image.alt || "Product image"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <label className="mt-4 grid gap-2 text-sm">
                      <span>Alt text</span>
                      <input
                        value={image.alt}
                        onChange={(event) => updateImage(index, { alt: event.target.value })}
                        className="admin-input"
                      />
                    </label>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={image.isPrimary ? "default" : "outline"}
                        onClick={() => setPrimaryImage(index)}
                      >
                        <Star className="h-4 w-4" />
                        {image.isPrimary ? "Primary photo" : "Make primary"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                      >
                        <GripVertical className="h-4 w-4" />
                        Up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                      >
                        <GripVertical className="h-4 w-4" />
                        Down
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Remove this photo from the product? The product will stay saved, but this photo will no longer show here."
                          )
                          if (confirmed) {
                            removeImage(index)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty mt-5 text-sm leading-7 text-foreground/64">
                No product photos yet. Add at least one clear image before saving a new product.
              </div>
            )}
          </ProductSection>

          <ProductSection
            eyebrow="Publish"
            title="Save, preview, or publish"
            description="Use these controls when the piece is ready to show in the shop or needs to stay hidden a little longer."
          >
            <div className="admin-soft-card rounded-[1.5rem] px-5 py-4 text-sm text-foreground/68">
              <div>
                Current visibility:{" "}
                <span className="font-medium text-[color:var(--foreground)]">
                  {statusLabel(product?.status || "draft")}
                </span>
              </div>
              {previewUrl ? (
                <div className="mt-3 flex items-start gap-2 text-[color:var(--primary)]">
                  <Eye className="mt-0.5 h-4 w-4 shrink-0" />
                  <Link href={previewUrl} className="underline-offset-4 hover:underline">
                    Preview {previewUrl}
                  </Link>
                </div>
              ) : (
                <div className="mt-3 text-foreground/56">
                  The preview link appears once a title or link name is entered.
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              <Button type="submit" name="intent" value="publish" className="h-12">
                Publish now
              </Button>
              <Button type="submit" name="intent" value="save" variant="outline" className="h-12">
                Save draft
              </Button>
              {!isNew ? (
                <Button
                  type="submit"
                  name="intent"
                  value="archive"
                  variant="outline"
                  className="h-12"
                >
                  Archive product
                </Button>
              ) : null}
            </div>
          </ProductSection>
        </aside>
      </div>
    </form>
  )
}

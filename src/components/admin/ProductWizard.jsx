"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import AdminImageUploader from "@/components/admin/AdminImageUploader"
import { Button } from "@/components/ui/button"
import { PRODUCT_CATEGORIES } from "@/lib/products"

const steps = [
  "What are you adding?",
  "Add photos",
  "Price and timing",
  "Customer details",
  "Review and publish",
]

const availabilityOptions = [
  "Available now",
  "Made to order",
  "Limited availability",
  "Hidden for now",
]

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function WizardHeader({ step }) {
  return (
    <div className="admin-surface rounded-[2rem] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
        Step {step + 1} of {steps.length}
      </p>
      <h2 className="mt-3 font-display text-[2.2rem] leading-none text-[color:var(--foreground)]">
        {steps[step]}
      </h2>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`h-2 rounded-full ${index <= step ? "bg-[color:var(--primary)]" : "bg-[rgba(117,84,72,0.12)]"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProductWizard({ action, successProduct = null }) {
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("tops")
  const [shortDescription, setShortDescription] = useState("")
  const [images, setImages] = useState([])
  const [price, setPrice] = useState("")
  const [leadDays, setLeadDays] = useState("")
  const [availability, setAvailability] = useState("Made to order")
  const [description, setDescription] = useState("")
  const [careNotes, setCareNotes] = useState("")
  const [fitNotes, setFitNotes] = useState("")
  const [customizationNotes, setCustomizationNotes] = useState("")
  const previewSlug = slugify(title)

  const summary = useMemo(
    () => ({
      title,
      category,
      shortDescription,
      image: images[0] || null,
      price,
      leadDays,
      availability,
      description,
      careNotes,
      fitNotes,
      customizationNotes,
    }),
    [title, category, shortDescription, images, price, leadDays, availability, description, careNotes, fitNotes, customizationNotes]
  )

  function validateCurrentStep() {
    if (step === 0 && (!title.trim() || !shortDescription.trim())) {
      return "Start with a title and a short description so the shop item is clear."
    }

    if (step === 1 && images.length === 0) {
      return "Add at least one photo so visitors can see the piece."
    }

    if (step === 2 && (!price || !leadDays)) {
      return "Add a price and lead time before moving on."
    }

    return ""
  }

  function nextStep() {
    const nextError = validateCurrentStep()
    if (nextError) {
      setError(nextError)
      return
    }

    setError("")
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  if (successProduct) {
    return (
      <section className="admin-surface rounded-[2rem] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          Saved
        </p>
        <h2 className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">
          Your shop item was saved.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/66">
          {successProduct.title} is ready. You can view it on the shop, add another item, or go back to the start screen.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/shop/${successProduct.slug}`}>View it on the shop</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/wizard/product">Add another item</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/products/${successProduct.id}`}>Edit this item</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/start">Back to start</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="shortDescription" value={shortDescription} />
      <input type="hidden" name="slug" value={previewSlug} />
      <input type="hidden" name="price" value={price} />
      <input type="hidden" name="leadDays" value={leadDays} />
      <input type="hidden" name="availability" value={availability} />
      <input type="hidden" name="status" value={availability === "Hidden for now" ? "draft" : "active"} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="careNotes" value={careNotes} />
      <input type="hidden" name="fitNotes" value={fitNotes} />
      <input type="hidden" name="customizationNotes" value={customizationNotes} />
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

      <WizardHeader step={step} />

      {error ? (
        <div className="rounded-[1.4rem] bg-[rgba(180,90,84,0.12)] px-5 py-4 text-sm text-[rgb(140,62,54)]">
          {error}
        </div>
      ) : null}

      {step === 0 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm sm:col-span-2">
              <span>Product title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="admin-input"
                placeholder="Crochet halter top"
              />
              <span className="text-xs leading-6 text-foreground/56">
                Use the name customers should see in the shop.
              </span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="admin-input">
                {PRODUCT_CATEGORIES.filter((item) => item.value !== "all").map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Short description</span>
              <textarea
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                rows={4}
                className="admin-textarea"
                placeholder="A soft handmade top in sunset tones with an easy summer fit."
              />
            </label>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <AdminImageUploader
            usageType="product"
            label="Add product photos"
            description="Use natural light, show the whole piece, and add a close-up if possible. Avoid cluttered backgrounds."
            onUploaded={(uploadedAssets) => {
              setImages((current) => [
                ...current,
                ...uploadedAssets.map((asset, index) => ({
                  src: asset.src,
                  alt: asset.alt || "Product photo",
                  isPrimary: current.length + index === 0,
                  sortOrder: current.length + index,
                })),
              ])
            }}
          />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {images.map((image, index) => (
              <article key={`${image.src}-${index}`} className="admin-soft-card rounded-[1.5rem] p-4">
                <div className="aspect-[4/4.3] overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                </div>
                <label className="mt-4 grid gap-2 text-sm">
                  <span>Photo description</span>
                  <input
                    value={image.alt}
                    onChange={(event) =>
                      setImages((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, alt: event.target.value } : item
                        )
                      )
                    }
                    className="admin-input"
                    placeholder="Describe the photo in one simple sentence."
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={image.isPrimary ? "default" : "outline"}
                    onClick={() =>
                      setImages((current) =>
                        current.map((item, itemIndex) => ({
                          ...item,
                          isPrimary: itemIndex === index,
                        }))
                      )
                    }
                  >
                    {image.isPrimary ? "Main photo" : "Make main photo"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm">
              <span>Price</span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="admin-input"
                type="number"
                step="0.01"
                placeholder="72"
              />
              <span className="text-xs leading-6 text-foreground/56">
                Enter the price customers should see.
              </span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Lead time</span>
              <input
                value={leadDays}
                onChange={(event) => setLeadDays(event.target.value)}
                className="admin-input"
                type="number"
                placeholder="7"
              />
              <span className="text-xs leading-6 text-foreground/56">
                How many days should customers expect before this is ready?
              </span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Availability</span>
              <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="admin-input">
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Full description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="admin-textarea"
                placeholder="What is it? Who is it good for? What makes it special?"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Care notes</span>
              <textarea
                value={careNotes}
                onChange={(event) => setCareNotes(event.target.value)}
                rows={3}
                className="admin-textarea"
                placeholder="Tell customers how to wash, store, or handle this piece."
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Sizing notes</span>
              <textarea
                value={fitNotes}
                onChange={(event) => setFitNotes(event.target.value)}
                rows={3}
                className="admin-textarea"
                placeholder="Share anything customers should know about fit or size."
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Customization notes</span>
              <textarea
                value={customizationNotes}
                onChange={(event) => setCustomizationNotes(event.target.value)}
                rows={3}
                className="admin-textarea"
                placeholder="Can colors or size be changed?"
              />
            </label>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              <div className="admin-soft-card rounded-[1.5rem] p-4">
                <p className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">{summary.title}</p>
                <p className="mt-2 text-sm text-foreground/58">{summary.category}</p>
                <p className="mt-4 text-sm leading-7 text-foreground/68">{summary.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="admin-pill">${Number(summary.price || 0).toFixed(2)}</span>
                  <span className="admin-pill">{summary.leadDays || "0"} days</span>
                  <span className="admin-pill">{summary.availability}</span>
                </div>
              </div>
              {summary.image ? (
                <div className="admin-soft-card rounded-[1.5rem] p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                    <img src={summary.image.src} alt={summary.image.alt} className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="admin-soft-card rounded-[1.5rem] p-4">
              <p className="text-sm leading-7 text-foreground/68">
                This review screen is your preview. Once you save, you can open the real shop page immediately.
              </p>
              {previewSlug ? (
                <p className="mt-3 text-sm text-foreground/56">Planned shop link: /shop/{previewSlug}</p>
              ) : null}
              <div className="mt-5 grid gap-3">
                <Button type="submit" name="intent" value={availability === "Hidden for now" ? "save" : "publish"} className="h-12">
                  {availability === "Hidden for now" ? "Keep hidden for now" : "Publish to shop"}
                </Button>
                <Button type="submit" name="intent" value="save" variant="outline" className="h-12">
                  Save as draft
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="admin-surface sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3 sm:px-5">
        <div className="text-sm text-foreground/62">Step {step + 1} of {steps.length}</div>
        <div className="flex flex-wrap gap-3">
          {step > 0 ? (
            <Button type="button" variant="outline" className="h-12" onClick={() => setStep((current) => current - 1)}>
              Back
            </Button>
          ) : null}
          {step < steps.length - 1 ? (
            <Button type="button" className="h-12" onClick={nextStep}>
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  )
}

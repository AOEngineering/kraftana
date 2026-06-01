"use client"

import Link from "next/link"
import { useState } from "react"

import AdminImageUploader from "@/components/admin/AdminImageUploader"
import { Button } from "@/components/ui/button"

const steps = [
  "What finished piece are you showing?",
  "Upload photo",
  "Optional details",
  "Review and publish",
]

const tagOptions = [
  "custom order",
  "wearable",
  "gift",
  "home piece",
  "detail shot",
  "work in progress",
]

function WizardHeader({ step }) {
  return (
    <div className="admin-surface rounded-[2rem] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
        Step {step + 1} of {steps.length}
      </p>
      <h2 className="mt-3 font-display text-[2.2rem] leading-none text-[color:var(--foreground)]">
        {steps[step]}
      </h2>
      <div className="mt-5 grid grid-cols-4 gap-2">
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

export default function GalleryWizard({ action, productOptions, saved = false }) {
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState(tagOptions[0])
  const [image, setImage] = useState(null)
  const [relatedProductSlug, setRelatedProductSlug] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState("active")

  function nextStep() {
    if (step === 0 && !title.trim()) {
      setError("Start with a title so this gallery piece is easy to recognize.")
      return
    }
    if (step === 1 && !image?.src) {
      setError("Add one clear photo before moving on.")
      return
    }
    setError("")
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  if (saved) {
    return (
      <section className="admin-surface rounded-[2rem] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          Saved
        </p>
        <h2 className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">
          Your gallery piece was saved.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/gallery">View gallery</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/wizard/gallery">Add another piece</Link>
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
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="tag" value={tag} />
      <input type="hidden" name="image" value={image?.src || ""} />
      <input type="hidden" name="alt" value={image?.alt || ""} />
      <input type="hidden" name="relatedProductSlug" value={relatedProductSlug} />
      <input type="hidden" name="status" value={status} />
      {isFeatured ? <input type="hidden" name="isFeatured" value="on" /> : null}

      <WizardHeader step={step} />

      {error ? <div className="rounded-[1.4rem] bg-[rgba(180,90,84,0.12)] px-5 py-4 text-sm text-[rgb(140,62,54)]">{error}</div> : null}

      {step === 0 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="admin-input" placeholder="Blue granny square cardigan" />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Short description</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="admin-textarea" placeholder="A favorite finished piece from a recent custom order." />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Tag</span>
              <select value={tag} onChange={(event) => setTag(event.target.value)} className="admin-input">
                {tagOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <AdminImageUploader
            usageType="gallery"
            label="Upload gallery photo"
            description="Choose one photo that shows the finished piece clearly."
            multiple={false}
            onUploaded={(assets) => {
              const [asset] = assets
              if (asset) setImage(asset)
            }}
          />
          {image ? (
            <div className="mt-5 admin-soft-card rounded-[1.5rem] p-4">
              <div className="aspect-[4/4.3] overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              </div>
              <label className="mt-4 grid gap-2 text-sm">
                <span>Photo description</span>
                <input
                  value={image.alt}
                  onChange={(event) => setImage({ ...image, alt: event.target.value })}
                  className="admin-input"
                  placeholder="Describe the photo in one simple sentence."
                />
              </label>
            </div>
          ) : null}
        </section>
      ) : null}

      {step === 2 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Related shop item</span>
              <select value={relatedProductSlug} onChange={(event) => setRelatedProductSlug(event.target.value)} className="admin-input">
                <option value="">None yet</option>
                {productOptions.map((product) => (
                  <option key={product.slug} value={product.slug}>{product.title}</option>
                ))}
              </select>
            </label>
            <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
              <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
              <span>Feature this on the gallery</span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Show publicly</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-input">
                <option value="active">Show publicly</option>
                <option value="archived">Keep hidden for now</option>
              </select>
            </label>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              <div className="admin-soft-card rounded-[1.5rem] p-4">
                <p className="font-display text-[2rem] leading-none text-[color:var(--foreground)]">{title}</p>
                <p className="mt-2 text-sm text-foreground/58">{tag}</p>
                <p className="mt-4 text-sm leading-7 text-foreground/68">{description || "No description yet."}</p>
              </div>
              {image ? (
                <div className="admin-soft-card rounded-[1.5rem] p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-[color:var(--surface-3)]">
                    <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="admin-soft-card rounded-[1.5rem] p-4 text-sm leading-7 text-foreground/66">
              Ready to save this gallery piece? You can always make changes later from the advanced gallery page.
            </div>
          </div>
        </section>
      ) : null}

      <div className="admin-surface sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3 sm:px-5">
        <div className="text-sm text-foreground/62">Step {step + 1} of {steps.length}</div>
        <div className="flex flex-wrap gap-3">
          {step > 0 ? <Button type="button" variant="outline" className="h-12" onClick={() => setStep((current) => current - 1)}>Back</Button> : null}
          {step < steps.length - 1 ? (
            <Button type="button" className="h-12" onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit" className="h-12">Save to gallery</Button>
          )}
        </div>
      </div>
    </form>
  )
}

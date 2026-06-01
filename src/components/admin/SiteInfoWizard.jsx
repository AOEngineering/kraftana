"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const steps = [
  "Contact info",
  "Announcement banner",
  "Custom order message",
  "Homepage featured products",
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
          <div key={label} className={`h-2 rounded-full ${index <= step ? "bg-[color:var(--primary)]" : "bg-[rgba(117,84,72,0.12)]"}`} />
        ))}
      </div>
    </div>
  )
}

export default function SiteInfoWizard({ action, settings, productOptions, saved = false }) {
  const [step, setStep] = useState(0)
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || "")
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || "")
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || "")
  const [announcementBannerEnabled, setAnnouncementBannerEnabled] = useState(Boolean(settings.announcementBannerEnabled))
  const [announcementBannerText, setAnnouncementBannerText] = useState(settings.announcementBannerText || "")
  const [customOrderAvailabilityText, setCustomOrderAvailabilityText] = useState(settings.customOrderAvailabilityText || "")
  const [shopIntroText, setShopIntroText] = useState(settings.shopIntroText || "")
  const [footerNote, setFooterNote] = useState(settings.footerNote || "")
  const [featuredSlugs, setFeaturedSlugs] = useState(settings.homepageFeaturedProductSlugs || [])

  if (saved) {
    return (
      <section className="admin-surface rounded-[2rem] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          Saved
        </p>
        <h2 className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">
          Your site info was updated.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Preview site</Link>
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
      <input type="hidden" name="contactEmail" value={contactEmail} />
      <input type="hidden" name="instagramUrl" value={instagramUrl} />
      <input type="hidden" name="facebookUrl" value={facebookUrl} />
      <input type="hidden" name="announcementBannerText" value={announcementBannerText} />
      <input type="hidden" name="customOrderAvailabilityText" value={customOrderAvailabilityText} />
      <input type="hidden" name="shopIntroText" value={shopIntroText} />
      <input type="hidden" name="footerNote" value={footerNote} />
      {announcementBannerEnabled ? <input type="hidden" name="announcementBannerEnabled" value="on" /> : null}
      {featuredSlugs.map((slug) => (
        <input key={slug} type="hidden" name="homepageFeaturedProductSlugs" value={slug} />
      ))}

      <WizardHeader step={step} />

      {step === 0 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Contact email</span>
              <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className="admin-input" />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Instagram URL</span>
              <input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} className="admin-input" />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Facebook URL</span>
              <input value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} className="admin-input" />
            </label>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
              <input type="checkbox" checked={announcementBannerEnabled} onChange={(event) => setAnnouncementBannerEnabled(event.target.checked)} />
              <span>Show the announcement banner</span>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Banner text</span>
              <input value={announcementBannerText} onChange={(event) => setAnnouncementBannerText(event.target.value)} className="admin-input" placeholder="Custom order requests are open this month." />
            </label>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Custom order message</span>
              <textarea value={customOrderAvailabilityText} onChange={(event) => setCustomOrderAvailabilityText(event.target.value)} rows={4} className="admin-textarea" placeholder="Custom orders are open. Share your idea, timeline, and size notes for a quote." />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Shop intro message</span>
              <textarea value={shopIntroText} onChange={(event) => setShopIntroText(event.target.value)} rows={4} className="admin-textarea" placeholder="Browse studio favorites and request the piece that feels closest to yours." />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Footer note</span>
              <input value={footerNote} onChange={(event) => setFooterNote(event.target.value)} className="admin-input" placeholder="Handmade in small batches." />
            </label>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
          <div className="grid gap-3">
            {productOptions.map((product) => (
              <label key={product.slug} className="admin-soft-card flex items-center gap-3 rounded-[1.3rem] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  checked={featuredSlugs.includes(product.slug)}
                  onChange={(event) =>
                    setFeaturedSlugs((current) =>
                      event.target.checked
                        ? [...current, product.slug]
                        : current.filter((slug) => slug !== product.slug)
                    )
                  }
                />
                <span>{product.title}</span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <div className="admin-surface sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3 sm:px-5">
        <div className="text-sm text-foreground/62">Step {step + 1} of {steps.length}</div>
        <div className="flex flex-wrap gap-3">
          {step > 0 ? <Button type="button" variant="outline" className="h-12" onClick={() => setStep((current) => current - 1)}>Back</Button> : null}
          {step < steps.length - 1 ? (
            <Button type="button" className="h-12" onClick={() => setStep((current) => current + 1)}>Next</Button>
          ) : (
            <Button type="submit" className="h-12">Save site info</Button>
          )}
        </div>
      </div>
    </form>
  )
}

import { buildMetadata } from "@/lib/metadata"
import { getPublicFaqContent } from "@/lib/publicData"

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "FAQ for Kraftana Studio covering custom crochet orders, sizing, care, handmade timelines, and shipping expectations.",
  path: "/faq",
})

export default async function FaqPage() {
  const faqItems = await getPublicFaqContent()
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Questions about handmade crochet, custom work, sizing, and care.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            A simple guide for first-time visitors, custom order clients, and anyone wondering what
            the Kraftana Studio process feels like.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="grid gap-5">
          {faqItems.map((item) => (
            <article key={item.question} className="paper-panel rounded-[2rem] p-6 sm:p-7">
              <h2 className="font-display text-3xl text-[color:var(--foreground)]">
                {item.question}
              </h2>
              <p className="mt-4 text-base leading-8 text-foreground/72">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

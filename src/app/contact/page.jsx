import ContactForm from "@/components/contact/ContactForm"
import { buildMetadata } from "@/lib/metadata"
import { siteConfig } from "@/lib/site"

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Kraftana Studio for custom crochet orders, handmade gift ideas, timeline questions, or general inquiries.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Contact and feedback</p>
          <h1 className="mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Share feedback, ask a question, or talk through an idea.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            Kraftana Studio is still growing, and thoughtful feedback is genuinely welcome. If there is a
            piece you would love to see, a question you need answered, or a note you want Kevonne to
            read, this is the right place.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-6 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <ContactForm />

        <div className="grid gap-6 lg:self-start">
          <article className="paper-panel rounded-[2rem] p-6 sm:p-7">
            <h2 className="font-display text-3xl text-[color:var(--foreground)]">Best for</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/68">
              <li>Custom crochet questions</li>
              <li>Gift ideas and timeline checks</li>
              <li>Feedback from friends, customers, and early visitors</li>
              <li>Requests for future handmade wearables or crochet gifts</li>
            </ul>
          </article>

          <article className="paper-panel rounded-[2rem] p-6 sm:p-7">
            <h2 className="font-display text-3xl text-[color:var(--foreground)]">Studio note</h2>
            <p className="mt-5 text-base leading-8 text-foreground/72">
              Kraftana Studio is a small studio, so replies are thoughtful rather than instant. The goal is
              simple: clear communication, honest expectations, and a warmer experience from first
              visit to finished piece.
            </p>
            <p className="mt-4 text-sm text-foreground/58">
              Based in {siteConfig.location}
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

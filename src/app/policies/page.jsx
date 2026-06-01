import { buildMetadata } from "@/lib/metadata"
import { getPublicPolicyContent } from "@/lib/publicData"

export const metadata = buildMetadata({
  title: "Policies",
  description:
    "Read Kraftana Studio policies for custom quotes, handmade timelines, shipping, sizing guidance, and crochet care.",
  path: "/policies",
})

export default async function PoliciesPage() {
  const policySections = await getPublicPolicyContent()

  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Policies and guidance</p>
          <h1 className="mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Simple expectations for custom work, shipping, sizing, and care.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            These notes are here to keep the process clear, warm, and fair. Kraftana Studio is a small
            handmade studio, so honest expectations matter.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="grid gap-5 lg:grid-cols-2">
          {policySections.map((section) => (
            <article key={section.title} className="paper-panel rounded-[2rem] p-6 sm:p-7">
              <h2 className="font-display text-3xl text-[color:var(--foreground)]">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-foreground/72">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

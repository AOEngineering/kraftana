import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const proof = [
  "Custom sizing and color planning",
  "Clear quote before stitching starts",
  "Small-batch finishing and gift-ready packaging",
]

const featured = [
  {
    src: "/images/autumn-granny-square-cardigan.jpeg",
    title: "Autumn cardigan",
    note: "Warm granny-square structure with a polished studio finish.",
    className: "lg:col-span-7",
    image: "aspect-[4/3]",
  },
  {
    src: "/images/sunset-chevron-halter-top.jpeg",
    title: "Chevron halter",
    note: "A brighter made-to-order piece with cleaner shape and rhythm.",
    className: "lg:col-span-5",
    image: "aspect-[4/5]",
  },
  {
    src: "/images/cobalt-fringe-scarf.jpeg",
    title: "Cobalt scarf",
    note: "Graphic color, soft drape, and handmade texture.",
    className: "lg:col-span-4",
    image: "aspect-[1/1]",
  },
  {
    src: "/images/striped-midi-skirt.jpeg",
    title: "Striped midi skirt",
    note: "A quieter palette with confident linework.",
    className: "lg:col-span-8",
    image: "aspect-[16/10]",
  },
]

const steps = [
  ["01", "Send the idea", "Share the piece, size, color direction, budget, and timing."],
  ["02", "Confirm the plan", "You get a clear quote and any detail questions before work starts."],
  ["03", "Receive the piece", "The finished order ships with simple care notes and a softer presentation."],
]

export default function MinimalLanding() {
  return (
    <div className="overflow-x-clip">
      <section className="relative border-b border-[color:var(--line-soft)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(157,100,93,0.16),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(120,150,173,0.15),transparent_24%)]" />

        <div className="section-shell relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Handmade crochet, edited down</p>
            <h1 className="mt-5 max-w-[10ch] font-display text-[3.8rem] leading-[0.86] tracking-[-0.03em] text-[color:var(--foreground)] sm:text-[5.6rem] lg:text-[6.6rem]">
              Soft pieces with a sharper point of view.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-foreground/74 sm:text-lg">
              Kraftana is a small crochet studio for custom wearables, gifts, and home pieces that
              feel personal without feeling overworked.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/custom">Start a custom request</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">View the shop</Link>
              </Button>
            </div>

            <div className="mt-9 grid gap-3">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/72">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="paper-panel relative min-h-[34rem] overflow-hidden rounded-[2.4rem] p-3 sm:p-4">
            <div className="relative h-full min-h-[32rem] overflow-hidden rounded-[1.9rem]">
              <WatermarkedImage
                src="/images/blush-sage-granny-square-top.jpeg"
                alt="Blush and sage crochet top photographed as a Kraftana studio piece"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                watermarkText="Kraftana"
                watermarkMode="corner"
                watermarkOpacity={0.36}
                watermarkPosition="bottom-right"
                preventDrag
                preventContextMenu
                imageClassName="object-cover"
              />
            </div>

            <div className="absolute bottom-7 left-7 right-7 rounded-[1.5rem] border border-white/35 bg-[rgba(255,250,246,0.78)] p-4 shadow-[0_22px_60px_rgba(87,56,47,0.18)] backdrop-blur-md dark:bg-[rgba(41,33,31,0.72)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                Studio focus
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/76">
                Fewer sections, stronger photography, and one clear path into custom orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow">Recent work</p>
            <h2 className="mt-4 max-w-[11ch] font-display text-4xl leading-[0.92] text-[color:var(--foreground)] sm:text-6xl">
              A tighter edit of texture and color.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-foreground/72">
            The page now reads less like a template storefront and more like a focused studio
            portfolio: fewer moving parts, clearer hierarchy, and faster decisions.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {featured.map((item, index) => (
            <article
              key={item.src}
              className={`paper-panel group overflow-hidden rounded-[2rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${item.className}`}
            >
              <div className={`relative overflow-hidden rounded-[1.45rem] ${item.image}`}>
                <WatermarkedImage
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  watermarkText="Kraftana"
                  watermarkMode={index % 2 === 0 ? "corner" : "pattern"}
                  watermarkOpacity={index % 2 === 0 ? 0.36 : 0.18}
                  watermarkPosition="bottom-right"
                  preventDrag
                  preventContextMenu
                  imageClassName="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-3 px-3 pb-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                    Piece {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
                    {item.title}
                  </h3>
                </div>
                <p className="max-w-sm text-sm leading-7 text-foreground/68">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wash border-y border-[color:var(--line-soft)]">
        <div className="section-shell grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Custom flow</p>
            <h2 className="mt-4 max-w-[10ch] font-display text-4xl leading-[0.92] text-[color:var(--foreground)] sm:text-6xl">
              Simple enough to start. Specific enough to quote.
            </h2>
          </div>

          <div className="grid gap-4">
            {steps.map(([number, title, copy]) => (
              <div key={number} className="paper-panel rounded-[1.65rem] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-3)] text-sm font-semibold text-[color:var(--primary)]">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-foreground/70">{copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="paper-panel grid gap-8 overflow-hidden rounded-[2.3rem] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">Ready when the idea is</p>
            <h2 className="mt-4 max-w-[13ch] font-display text-4xl leading-[0.92] text-[color:var(--foreground)] sm:text-6xl">
              Build the next piece around your palette, size, and timeline.
            </h2>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/custom">
              Open the request form
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

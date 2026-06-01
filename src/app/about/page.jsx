import Link from "next/link"
import { BookOpen, Heart, Sparkles, Users } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const facts = [
  { icon: Users, label: "Size-inclusive by design" },
  { icon: Sparkles, label: "Handmade pieces, one by one" },
  { icon: BookOpen, label: "Built from personal style and real need" },
  { icon: Heart, label: "Care, comfort, and confidence" },
]

export default function AboutPage() {
  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">About the maker</p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            About Kevonne Workman
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            The hands and heart behind Kraftana Studio, creating handmade crochet with warmth,
            self-expression, and a real love for pieces that feel personal.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.15fr]">
        <article className="paper-panel overflow-hidden rounded-[2rem] p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
            <WatermarkedImage
              src="/images/autumn-granny-square-cardigan.jpeg"
              alt="Autumn granny square cardigan styled in the Kraftana Studio"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              showWatermark={false}
              imageClassName="object-cover"
            />
          </div>
          <div className="px-3 pb-2 pt-4 text-sm text-foreground/58">Kraftana Studio, Cleveland, Ohio</div>
        </article>

        <article className="paper-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5 text-[0.98rem] leading-8 text-foreground/72">
            <p>
              Hi, I&apos;m Kevonne Workman. Kraftana Studio started with a simple frustration: I wanted cute,
              stylish handmade pieces that actually felt like they were made with women like me in
              mind.
            </p>

            <p>
              Instead of waiting to find them, I picked up my crochet hook and started making them
              myself. What began as a personal need grew into a small studio rooted in creativity,
              comfort, and the belief that handmade work can still feel polished, modern, and full
              of personality.
            </p>

            <p>
              Custom work matters to me because people do not all want the same fit, the same
              palette, or the same feeling from what they wear. Crochet gives me room to build
              around real bodies, real preferences, and the small details that make something feel
              truly yours.
            </p>

            <p>
              When I&apos;m not crocheting, I&apos;m usually reading, spending time with family, or learning
              another craft that sends me right back into color and texture again. Thank you for
              being here and spending time with the studio.
            </p>
          </div>

          <div className="mt-6">
            <div className="font-semibold text-[color:var(--foreground)]">With love and yarn,</div>
            <div className="mt-1 flex items-center gap-2 text-[color:var(--foreground)]">
              <span className="font-medium">Kevonne</span>
              <Heart className="h-4 w-4" />
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((fact) => {
              const Icon = fact.icon

              return (
                <li
                  key={fact.label}
                  className="rounded-[1.25rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(242,223,220,0.72)] text-[color:var(--primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-[color:var(--foreground)]">{fact.label}</span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/custom">Start a custom request</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Explore the shop</Link>
            </Button>
          </div>
        </article>
      </section>
    </main>
  )
}

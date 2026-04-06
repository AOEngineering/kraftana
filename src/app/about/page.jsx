"use client"

import Link from "next/link"
import { BookOpen, Heart, Sparkles, Users } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const facts = [
  { icon: Users, label: "Size inclusive by design" },
  { icon: Sparkles, label: "Handmade pieces, one by one" },
  { icon: BookOpen, label: "Always learning, always creating" },
  { icon: Heart, label: "Care, comfort, and longevity" },
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
            The hands and heart behind Kraftana, building handmade crochet with warmth,
            self-expression, and a more personal point of view.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.15fr]">
        <article className="paper-panel overflow-hidden rounded-[2rem] p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
            <WatermarkedImage
              src="/images/autumn-granny-square-cardigan.jpeg"
              alt="Autumn granny square cardigan styled in the Kraftana studio"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              watermarkMode="corner"
              watermarkOpacity={0.24}
              watermarkPosition="bottom-right"
              imageClassName="object-cover"
            />
          </div>
          <div className="px-3 pb-2 pt-4 text-sm text-foreground/58">Kraftana studio, Cleveland, Ohio</div>
        </article>

        <article className="paper-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5 text-[0.98rem] leading-8 text-foreground/72">
            <p>
              Hi, I am Kevonne Workman. I started Kraftana because I was tired of not finding cute,
              stylish pieces made for women of my size. I picked up my crochet hook, trusted my
              creativity, and decided to make them myself.
            </p>

            <p>
              What began as a personal need grew into a brand rooted in self expression,
              inclusivity, and handcrafted joy. Each piece is meant to feel intentional, wearable,
              and genuinely made with care.
            </p>

            <p>
              When I am not crocheting, I am reading a good book, spending time with family, or
              learning new crafts to keep the creativity flowing. Texture, color, and the quiet
              magic of making something from scratch still shape everything I do.
            </p>

            <p>
              Thank you for being here. I hope you find something at Kraftana that feels warm,
              personal, and beautifully yours.
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

import Link from "next/link"

import WatermarkedImage from "@/components/WatermarkedImage"
import { buildMetadata } from "@/lib/metadata"
import { getPublicGalleryItems } from "@/lib/publicData"
import { Button } from "@/components/ui/button"

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Browse handmade crochet by Kraftana Studio, including custom wearables, accessories, and color-rich studio pieces.",
  path: "/gallery",
})

export const dynamic = "force-dynamic"

export default async function GalleryPage() {
  const items = await getPublicGalleryItems()

  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Gallery</p>
          <h1 className="mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Handmade crochet pieces, color stories, and studio favorites.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            This gallery shows the kinds of shapes, palettes, and handmade textures Kevonne loves to
            create. Use it as inspiration for custom crochet clothing, crochet gifts, or your next
            one-of-a-kind request.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="paper-panel overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                <WatermarkedImage
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  showWatermark={false}
                  imageClassName="object-cover"
                />
              </div>
              <div className="px-3 pb-3 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                  {item.tag}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-foreground/68">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/custom">Start a custom request</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Explore the shop</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

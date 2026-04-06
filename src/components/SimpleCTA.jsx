import Link from "next/link"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const thumbs = [
  { src: "/Images/patchwork-drawstring-skirt.jpeg", alt: "Patchwork drawstring crochet skirt in coral and aqua" },
  { src: "/Images/pastel-granny-square-skirt.jpeg", alt: "Pastel granny square crochet skirt" },
  { src: "/Images/ombre-crochet-skirt.jpeg", alt: "Ombre crochet skirt fading from cream to blush" },
]

export default function SimpleCTA() {
  return (
    <section className="section-shell py-16 sm:py-24">
      <div className="paper-panel relative overflow-hidden rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(194,122,90,0.12),transparent_26%),radial-gradient(circle_at_82%_78%,rgba(120,150,173,0.12),transparent_24%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">Final invitation</p>
            <h2 className="mt-4 max-w-[12ch] font-display text-4xl leading-[0.94] text-[color:var(--foreground)] sm:text-5xl">
              Make room for something softer, slower, and more personal.
            </h2>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-foreground/78">
              If you want a piece that feels considered rather than mass produced, the studio is
              open for custom requests and carefully finished crochet work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/custom">Start a custom request</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">See what is in the shop</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <div className="paper-panel overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <WatermarkedImage
                  src={thumbs[0].src}
                  alt={thumbs[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  watermarkText="Kraftana"
                  watermarkMode="corner"
                  watermarkOpacity={0.38}
                  watermarkPosition="bottom-right"
                  preventDrag
                  preventContextMenu
                  imageClassName="object-cover"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {thumbs.slice(1).map((thumb, index) => (
                <div
                  key={thumb.src}
                  className={`paper-panel overflow-hidden rounded-[1.6rem] p-3 ${index === 1 ? "md:ml-6" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem]">
                    <WatermarkedImage
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      watermarkText="Kraftana"
                      watermarkMode={index === 0 ? "pattern" : "corner"}
                      watermarkOpacity={index === 0 ? 0.18 : 0.36}
                      watermarkPosition="bottom-right"
                      preventDrag
                      preventContextMenu
                      imageClassName="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

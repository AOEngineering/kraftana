import Link from "next/link"
import { HeartHandshake, Ribbon, Sparkles } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const photoStack = [
  {
    src: "/images/autumn-granny-square-cardigan.jpeg",
    alt: "Autumn granny square cardigan laid out in warm studio light",
    shell: "right-[4%] top-2 w-[58%] sm:right-[7%] sm:w-[54%]",
    frame: "aspect-[4/5]",
    rotate: "rotate-[4deg]",
    watermarkMode: "corner",
  },
  {
    src: "/images/cobalt-fringe-scarf.jpeg",
    alt: "Cobalt blue fringe scarf arranged like a printed studio photograph",
    shell: "left-[3%] top-[18%] w-[40%] sm:left-[6%] sm:w-[36%]",
    frame: "aspect-[4/5]",
    rotate: "-rotate-[7deg]",
    watermarkMode: "corner",
  },
  {
    src: "/images/striped-midi-skirt.jpeg",
    alt: "Striped midi skirt with soft blue, cream, and berry bands",
    shell: "left-[18%] bottom-[3%] w-[48%] sm:left-[21%] sm:w-[44%]",
    frame: "aspect-[1/1]",
    rotate: "-rotate-[3deg]",
    watermarkMode: "pattern",
  },
]

const values = [
  {
    icon: HeartHandshake,
    title: "Small-batch stitching",
    copy: "Each piece is worked by hand with a slower pace, cleaner finishing, and more attention to feel.",
  },
  {
    icon: Ribbon,
    title: "Gift-ready finish",
    copy: "Soft wrapping, polished presentation, and details that feel considered before the package opens.",
  },
  {
    icon: Sparkles,
    title: "Custom color stories",
    copy: "Made-for-you palettes and subtle adjustments are part of the studio process from the beginning.",
  },
]

export default function HeroIntro() {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--line-soft)]">
      <div className="hero-wash absolute inset-0" />
      <div className="absolute left-[8%] top-[10%] h-36 w-36 rounded-full bg-[rgba(194,122,90,0.15)] blur-3xl" />
      <div className="absolute right-[12%] top-[18%] h-44 w-44 rounded-full bg-[rgba(120,150,173,0.14)] blur-3xl" />

      <div className="section-shell relative grid gap-14 py-14 sm:py-20 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:py-26">
        <div className="max-w-2xl">
          <span className="eyebrow">Boutique crochet studio</span>

          <h1 className="mt-5 max-w-[11ch] font-display text-[3.65rem] leading-[0.88] tracking-[-0.02em] text-[color:var(--foreground)] sm:text-[5.15rem] lg:text-[6rem]">
            Heirloom softness, made with a studio-table soul.
          </h1>

          <p className="mt-5 max-w-xl text-[1.04rem] leading-8 text-foreground/78 sm:text-[1.12rem]">
            Handmade crochet for meaningful gifting, quieter rooms, and custom pieces that feel
            personal before they ever arrive at your door.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Browse recent pieces</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/custom">Plan a custom order</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon

              return (
                <div key={value.title} className="paper-panel rounded-[1.55rem] p-4 sm:p-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-3)] text-[color:var(--primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="min-h-[2.5rem] text-[12px] font-semibold uppercase leading-5 tracking-[0.16em] text-[color:var(--foreground)] sm:min-h-[3rem]">
                      {value.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/72 sm:text-[0.96rem]">{value.copy}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-h-[470px] sm:min-h-[590px]">
          <div className="paper-panel absolute inset-x-[10%] top-[7%] bottom-[12%] rounded-[2.4rem] border-[rgba(255,255,255,0.14)] p-4 shadow-[var(--shadow-lift)]" />

          {photoStack.map((photo, index) => (
            <figure
              key={photo.src}
              className={`absolute ${photo.shell} ${photo.rotate} overflow-hidden rounded-[1.95rem] border border-white/20 bg-[color:var(--surface-4)] p-3 shadow-[var(--shadow-lift)]`}
            >
              <div className={`relative overflow-hidden rounded-[1.3rem] ${photo.frame}`}>
                <WatermarkedImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 70vw, 30vw"
                  watermarkText="Kraftana"
                  watermarkMode={photo.watermarkMode}
                  watermarkOpacity={photo.watermarkMode === "pattern" ? 0.18 : 0.38}
                  watermarkPosition="bottom-right"
                  preventDrag
                  preventContextMenu
                  imageClassName="object-cover"
                />
              </div>
            </figure>
          ))}

          <div className="paper-panel absolute bottom-[2%] right-[2%] max-w-[15rem] rounded-[1.6rem] border-[rgba(120,150,173,0.16)] p-4 sm:bottom-[6%] sm:right-[6%] sm:max-w-[17rem] sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--chart-4)]">
              Studio note
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/76">
              Color, drape, and stitch texture are styled like a studio keepsake rather than a fast
              product listing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

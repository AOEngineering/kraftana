"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"

const slides = [
  {
    src: "/images/blush-sage-granny-square-top.jpeg",
    title: "Blush and sage square top",
    blurb: "A delicate square-motif top in white, blush, and sage that reads soft and airy instead of heavy.",
    note: "Soft layering",
  },
  {
    src: "/images/striped-midi-skirt.jpeg",
    title: "Striped midi skirt",
    blurb: "Crisp horizontal bands and a longer silhouette give this handmade skirt a more tailored, boutique feel.",
    note: "Quiet statement",
  },
  {
    src: "/images/cobalt-fringe-scarf.jpeg",
    title: "Cobalt fringe scarf",
    blurb: "Bright blue fringe and open stitching turn a classic scarf into something more graphic and memorable.",
    note: "Studio favorite",
  },
  {
    src: "/images/blue-granny-square-cardigan.jpeg",
    title: "Blue granny square cardigan",
    blurb: "A cool-toned cardigan with crisp edging and visible stitch structure that photographs beautifully.",
    note: "Texture first",
  },
]

export default function ShowcaseCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="paper-panel relative overflow-hidden rounded-[2.5rem] p-5 sm:p-7 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(194,122,90,0.14),transparent_26%),radial-gradient(circle_at_84%_74%,rgba(114,141,126,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_62%)]" />

      <div className="relative mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">Featured strip</p>
          <h2 className="mt-4 max-w-[11ch] font-display text-4xl leading-[0.94] text-[color:var(--foreground)] sm:text-[4.7rem]">
            A rolling edit of the pieces that hold a room.
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-8 text-foreground/76">
            Instead of flattening everything into a storefront row, this strip keeps the focus on
            drape, texture, and the details that make handmade work feel memorable.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="max-w-sm rounded-[1.5rem] border border-[rgba(145,90,81,0.16)] bg-[rgba(255,248,243,0.7)] p-4 text-sm leading-7 text-foreground/70 dark:bg-[rgba(41,33,31,0.58)]">
            Soft accents, stronger pacing, and a little more warmth so the lower half of the page
            feels as intentional as the opening impression.
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi && emblaApi.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[66%] xl:basis-[44%]"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(145,90,81,0.14)] bg-[color:var(--surface-2)] p-3 shadow-[0_18px_40px_rgba(87,56,47,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
                  <WatermarkedImage
                    src={slide.src}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 88vw, (max-width: 1280px) 64vw, 38vw"
                    watermarkText="Kraftana"
                    watermarkMode={index % 2 === 0 ? "corner" : "pattern"}
                    watermarkOpacity={index % 2 === 0 ? 0.36 : 0.18}
                    watermarkPosition="bottom-right"
                    preventDrag
                    preventContextMenu
                    imageClassName="object-cover"
                  />

                  <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/45 bg-[rgba(255,250,246,0.72)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--chart-4)] shadow-[0_14px_28px_rgba(87,56,47,0.12)] backdrop-blur-md dark:bg-[rgba(41,33,31,0.64)]">
                    {slide.note}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between px-3 pb-3 pt-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                      Featured piece {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-[1.45rem] font-semibold text-[color:var(--foreground)]">
                      {slide.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-foreground/72 transition duration-300 group-hover:text-foreground/86">
                    {slide.blurb}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

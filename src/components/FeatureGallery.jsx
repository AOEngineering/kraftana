import WatermarkedImage from "@/components/WatermarkedImage"
import { cn } from "@/lib/utils"

const items = [
  {
    src: "/Images/sunset-chevron-halter-top.jpeg",
    title: "Sunset chevron halter",
    tag: "Made to order",
    description: "A warm chevron halter with citrus, cream, and rust tones that feels playful without losing polish.",
    ratio: "aspect-[4/5]",
    className: "xl:col-span-5 xl:row-span-2 xl:translate-y-6",
    imageWrap: "h-full min-h-[21rem] xl:min-h-[36rem]",
    watermarkMode: "corner",
  },
  {
    src: "/Images/blush-sage-granny-square-top.jpeg",
    title: "Blush and sage square top",
    tag: "Best seller",
    description: "A soft white base with blush and sage squares, styled like a delicate summer layer on the worktable.",
    ratio: "aspect-[4/3]",
    className: "xl:col-span-4",
    watermarkMode: "corner",
  },
  {
    src: "/Images/striped-crochet-beanie.jpeg",
    title: "Blue stripe beanie",
    tag: "Gift ready",
    description: "Chunky stitched stripes in blue, oat, and cream that make a simple cold-weather piece feel tactile and clean.",
    ratio: "aspect-[4/3]",
    className: "xl:col-span-3 xl:-translate-y-5",
    watermarkMode: "pattern",
  },
  {
    src: "/Images/blue-granny-square-cardigan.jpeg",
    title: "Blue granny square cardigan",
    tag: "Studio favorite",
    description: "A cooler palette and classic square construction with enough contrast to show off the stitchwork beautifully.",
    ratio: "aspect-[3/4]",
    className: "xl:col-span-3 xl:translate-y-3",
    watermarkMode: "corner",
  },
  {
    src: "/Images/striped-midi-skirt.jpeg",
    title: "Striped midi skirt",
    tag: "Soft texture",
    description: "Wide blue, cream, olive, and berry bands give this skirt a clean shape with a softer handmade finish.",
    ratio: "aspect-[1/1]",
    className: "xl:col-span-4",
    watermarkMode: "corner",
  },
  {
    src: "/Images/patchwork-drawstring-skirt.jpeg",
    title: "Patchwork drawstring skirt",
    tag: "Fresh palette",
    description: "A lively patchwork of coral, aqua, and cream squares tied together with a softer drawstring waist.",
    ratio: "aspect-[4/5]",
    className: "xl:col-span-5 xl:-translate-y-4",
    watermarkMode: "pattern",
  },
]

export default function FeatureGallery() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Recent work</p>
          <h2 className="mt-4 max-w-[12ch] font-display text-4xl leading-[0.94] text-[color:var(--foreground)] sm:text-[5rem]">
            A more editorial look at the studio table.
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-8 text-foreground/76">
            The layout is paced more intentionally now, with varied scale and breathing room so the
            handmade texture reads before the card shape does.
          </p>
        </div>

        <p className="max-w-sm text-sm leading-7 text-foreground/68">
          Less storefront grid, more curated collection. The rhythm is uneven on purpose, but still
          disciplined enough to stay clean on mobile.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:auto-rows-[minmax(14rem,auto)] xl:grid-cols-12">
        {items.map((item) => (
          <article
            key={item.src}
            className={cn(
              "group paper-panel flex h-full flex-col overflow-hidden rounded-[2.1rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
              item.className
            )}
          >
            <div className={cn("relative overflow-hidden rounded-[1.55rem]", item.imageWrap ?? item.ratio)}>
              <WatermarkedImage
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                watermarkText="Kraftana"
                watermarkMode={item.watermarkMode}
                watermarkOpacity={item.watermarkMode === "pattern" ? 0.18 : 0.36}
                watermarkPosition="bottom-right"
                preventDrag
                preventContextMenu
                imageClassName="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between px-3 pb-3 pt-5">
              <div>
                <span className="inline-flex rounded-full bg-[color:var(--surface-3)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--chart-4)]">
                  {item.tag}
                </span>
                <h3 className="mt-4 text-[1.38rem] font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </h3>
              </div>

              <p className="mt-3 max-w-[34rem] text-sm leading-7 text-foreground/74 transition duration-300 group-hover:text-foreground/88">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

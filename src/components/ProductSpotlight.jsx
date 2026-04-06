import WatermarkedImage from "@/components/WatermarkedImage"

const items = [
  { src: "/images/sunset-chevron-halter-top.jpeg", title: "Sunset chevron halter", tag: "Made to order" },
  { src: "/images/blush-sage-granny-square-top.jpeg", title: "Blush and sage square top", tag: "Best seller" },
  { src: "/images/striped-midi-skirt.jpeg", title: "Striped midi skirt", tag: "Customer fave" },
  { src: "/images/striped-crochet-beanie.jpeg", title: "Blue stripe beanie", tag: "Gift ready" },
]

export default function ProductSpotlight() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-4xl leading-none text-[color:var(--foreground)]">Spotlight</h2>
        <p className="text-sm text-foreground/64">A peek at recent work</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.src}
            className="paper-panel overflow-hidden rounded-[1.9rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
              <WatermarkedImage
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                watermarkMode="corner"
                watermarkOpacity={0.34}
                watermarkPosition="bottom-right"
                imageClassName="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="text-xs">
                <span className="rounded-full bg-[color:var(--surface-3)] px-3 py-1 font-semibold uppercase tracking-[0.22em] text-[color:var(--primary)]">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-[color:var(--foreground)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-foreground/68">
                Distinct color stories, polished shaping, and a softer handmade finish.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

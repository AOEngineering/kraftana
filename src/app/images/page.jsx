import WatermarkedImage from "@/components/WatermarkedImage"

const images = [
  "pastel-granny-square-skirt.jpeg",
  "sunset-chevron-halter-top.jpeg",
  "autumn-granny-square-cardigan.jpeg",
  "blush-sage-granny-square-top.jpeg",
  "blue-granny-square-cardigan.jpeg",
  "striped-crochet-beanie.jpeg",
  "patchwork-drawstring-skirt.jpeg",
  "cobalt-fringe-scarf.jpeg",
  "ombre-crochet-skirt.jpeg",
  "floral-granny-square-skirt.jpeg",
  "striped-midi-skirt.jpeg",
]

export const metadata = {
  title: "Images | Kraftana",
  description: "Studio image library preview.",
}

function formatLabel(file) {
  return file
    .replace(".jpeg", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function ImagesPage() {
  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Image library</p>
          <h1 className="mt-4 font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Public studio photos
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
            These files are coming from `public/Images`. Direct file URLs also work, for example
            `/Images/striped-midi-skirt.jpeg`.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((file) => (
            <article key={file} className="paper-panel overflow-hidden rounded-[1.8rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                <WatermarkedImage
                  src={`/Images/${file}`}
                  alt={formatLabel(file)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  watermarkMode="corner"
                  watermarkOpacity={0.22}
                  watermarkPosition="bottom-right"
                  imageClassName="object-cover"
                />
              </div>
              <p className="px-2 pb-2 pt-4 text-sm text-foreground/62">{formatLabel(file)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

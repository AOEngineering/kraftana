import Link from "next/link"
import { notFound } from "next/navigation"

import WatermarkedImage from "@/components/WatermarkedImage"
import { absoluteUrl } from "@/lib/metadata"
import { buildMetadata } from "@/lib/metadata"
import { getPublicProductBySlug } from "@/lib/publicData"
import { PRODUCTS, formatPrice, getProductBySlug } from "@/lib/products"
import { Button } from "@/components/ui/button"
import RecentlyViewedProducts from "@/components/shop/RecentlyViewedProducts"

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }) {
  const product = (await getPublicProductBySlug(params.slug)) || getProductBySlug(params.slug)

  if (!product) {
    return buildMetadata({
      title: "Product",
      description: "Handmade crochet from Kraftana Studio.",
      path: "/shop",
    })
  }

  return buildMetadata({
    title: product.title,
    description: `${product.shortDescription} Handmade crochet from Kevonne Workman's Cleveland studio.`,
    path: `/shop/${product.slug}`,
    image: product.images[0]?.src,
  })
}

export default async function ProductDetailPage({ params }) {
  const product = await getPublicProductBySlug(params.slug)

  if (!product) notFound()

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((image) => image.src),
    brand: {
      "@type": "Brand",
      name: "Kraftana",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/shop/${product.slug}`),
    },
  }
  const related = PRODUCTS.filter(
    (item) => item.slug !== product.slug && item.category === product.category
  ).slice(0, 4)

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">{product.categoryLabel}</p>
          <h1 className="mt-4 max-w-4xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            {product.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            {product.shortDescription}
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.map((image, index) => (
              <article
                key={image.src}
                className={`paper-panel overflow-hidden rounded-[2rem] p-3 ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-[1.45rem] ${
                    index === 0 ? "aspect-[4/3]" : "aspect-[4/5]"
                  }`}
                >
                  <WatermarkedImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    showWatermark={false}
                    imageClassName="object-cover"
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <article className="paper-panel rounded-[2rem] p-6 sm:p-7">
              <div className="text-3xl font-semibold text-[color:var(--foreground)]">
                {formatPrice(product.price)}
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Lead time</span>
                  <span className="font-medium text-[color:var(--foreground)]">
                    {product.leadDays} days
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Availability</span>
                  <span className="font-medium text-[color:var(--foreground)]">
                    {product.availability}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <Link href={`/custom?piece=${product.slug}`}>Request this piece</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/custom">Start a custom request</Link>
                </Button>
                <div className="rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3 text-sm leading-7 text-foreground/66">
                  Reply goal: within 1 to 2 business days. No payment is due until your quote is confirmed.
                </div>
              </div>
            </article>

            <article className="paper-panel rounded-[2rem] p-6 sm:p-7">
              <h2 className="font-display text-3xl text-[color:var(--foreground)]">
                Piece details
              </h2>
              <div className="mt-5 space-y-5 text-[0.98rem] leading-8 text-foreground/72">
                <p>{product.description}</p>
                <div>
                  <div className="font-semibold text-[color:var(--foreground)]">Care notes</div>
                  <p>{product.careNotes}</p>
                </div>
                <div>
                  <div className="font-semibold text-[color:var(--foreground)]">Sizing and fit</div>
                  <p>{product.fitNotes}</p>
                </div>
                <div>
                  <div className="font-semibold text-[color:var(--foreground)]">
                    Customization
                  </div>
                  <p>{product.customizationNotes}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell pb-10 sm:pb-14">
        <div className="grid gap-6 lg:grid-cols-2">
          {related.length ? (
            <article className="paper-panel rounded-[2rem] p-6 sm:p-7">
              <h2 className="font-display text-3xl text-[color:var(--foreground)]">Related pieces</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/shop/${item.slug}`}
                    className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-2 text-sm text-foreground/74 transition hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </article>
          ) : null}

          <RecentlyViewedProducts currentSlug={product.slug} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--line-soft)] bg-[rgba(255,252,248,0.94)] p-3 backdrop-blur sm:hidden">
        <div className="section-shell flex items-center gap-2">
          <Button asChild className="flex-1">
            <Link href={`/custom?piece=${product.slug}`}>Request this piece</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/shop">Back to shop</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

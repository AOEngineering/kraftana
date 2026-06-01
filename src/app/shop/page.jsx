import ShopClient from "@/components/shop/ShopClient"
import { buildMetadata } from "@/lib/metadata"
import { getPublicProducts, getPublicSiteSettings } from "@/lib/publicData"

export const metadata = buildMetadata({
  title: "Shop",
  description:
    "Shop handmade crochet tops, skirts, cardigans, and accessories from Kraftana Studio in Cleveland, Ohio.",
  path: "/shop",
})

export const dynamic = "force-dynamic"

export default async function ShopPage() {
  const [products, siteSettings] = await Promise.all([
    getPublicProducts(),
    getPublicSiteSettings(),
  ])

  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Studio collection</p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Handmade crochet pieces with warmth, texture, and room for custom touches.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            {siteSettings.shopIntroText ||
              "Browse studio favorites, explore details, and request the piece that feels closest to yours. If you need a different color, fit, or finish, custom requests are always welcome."}
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <ShopClient products={products} />
      </section>
    </main>
  )
}

import MinimalLanding from "@/components/MinimalLanding"
import { buildMetadata } from "@/lib/metadata"
import {
  getPublicProducts,
  getPublicSiteSettings,
  getPublicTestimonials,
} from "@/lib/publicData"
import { siteConfig } from "@/lib/site"

export const metadata = buildMetadata({
  description: siteConfig.description,
  path: "/",
})

export const dynamic = "force-dynamic"

export default async function Page() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    alternateName: siteConfig.wordmark,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    image: `${siteConfig.baseUrl}${siteConfig.ogImage}`,
    email: siteConfig.email,
    knowsAbout: siteConfig.keywords,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cleveland",
      addressRegion: "OH",
      addressCountry: "US",
    },
    areaServed: "Cleveland, Ohio",
  }

  const [products, siteSettings, testimonials] = await Promise.all([
    getPublicProducts(),
    getPublicSiteSettings(),
    getPublicTestimonials(),
  ])

  const featuredSlugs =
    siteSettings.homepageFeaturedProductSlugs || [
      "blush-sage-square-top",
      "blue-granny-square-cardigan",
      "striped-midi-skirt",
    ]
  const featuredProducts = products.filter((product) =>
    featuredSlugs.includes(product.slug)
  )

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <MinimalLanding
        featuredProducts={featuredProducts.length ? featuredProducts : products.slice(0, 4)}
        siteSettings={siteSettings}
        testimonials={testimonials}
      />
    </div>
  )
}

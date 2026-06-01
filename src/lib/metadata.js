import { siteConfig } from "@/lib/site"

export function absoluteUrl(path = "") {
  const base = siteConfig.baseUrl.replace(/\/$/, "")
  const nextPath = path ? (path.startsWith("/") ? path : `/${path}`) : ""
  return `${base}${nextPath}`
}

export function buildMetadata({
  title,
  description,
  path = "",
  image = siteConfig.ogImage,
}) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const url = absoluteUrl(path)
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image)

  return {
    title: fullTitle,
    description,
    keywords: siteConfig.keywords,
    category: "Handmade Goods",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

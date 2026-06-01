import { getStaticRoutes, siteConfig } from "@/lib/site"

export default function sitemap() {
  const now = new Date()
  const baseUrl = siteConfig.baseUrl.replace(/\/$/, "")

  return getStaticRoutes().map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/shop/") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/shop" || route === "/custom" ? 0.9 : 0.7,
  }))
}

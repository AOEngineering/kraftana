import { siteConfig } from "@/lib/site"

export async function GET() {
  const sitemapUrl = `${siteConfig.baseUrl.replace(/\/$/, "")}/sitemap.xml`
  const body = `
User-agent: *
Disallow: /api/
Disallow: /admin/
Allow: /

Sitemap: ${sitemapUrl}
`.trim()

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

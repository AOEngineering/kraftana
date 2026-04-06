// app/robots.txt/route.js

export async function GET() {
  const body = `
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /.*
Allow: /

Sitemap: https://aoengineering.io/sitemap.xml
`.trim()

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

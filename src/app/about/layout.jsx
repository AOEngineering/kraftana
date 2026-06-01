import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "About Kevonne",
  description:
    "Meet Kevonne Workman, the maker behind Kraftana Studio in Cleveland, creating handmade crochet, custom orders, and size-inclusive pieces.",
  path: "/about",
})

export default function AboutLayout({ children }) {
  return children
}

import dynamicImport from "next/dynamic"
import { buildMetadata } from "@/lib/metadata"
import { getPublicProductBySlug, getPublicProductGuides } from "@/lib/publicData"

const CustomOrderForm = dynamicImport(() => import("@/components/custom-order/CustomOrderForm"), {
  loading: () => <div className="paper-panel min-h-[42rem] rounded-[2rem]" />,
})

export const metadata = buildMetadata({
  title: "Custom Orders",
  description:
    "Request a custom crochet order from Kraftana Studio, share size and color ideas, and receive a quote before stitching begins.",
  path: "/custom",
})

export const dynamic = "force-dynamic"

export default async function CustomPage({ searchParams }) {
  const params = await searchParams
  const requestedPiece = params?.piece ?? ""
  const guides = await getPublicProductGuides()
  const requestedProduct = requestedPiece ? await getPublicProductBySlug(requestedPiece) : null

  return (
    <div className="relative">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-transparent">
        <div className="section-shell grid gap-8 py-14 sm:py-18 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow">Custom order</p>
            <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.02em] text-[color:var(--foreground)] sm:text-[5.4rem]">
              Start a custom request
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
              Pick what you want made, choose a size, and tell us your colors. Kevonne will
              follow up to confirm details, timing, and price before anything is final.
            </p>
          </div>

          <div className="paper-panel rounded-[1.7rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--primary)]">
              Timing note
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              Most custom pieces need about 2 weeks for yarn to arrive, plus 1 to 2 weeks for
              creation. Larger or more detailed pieces may take longer.
            </p>
          </div>
        </div>
      </section>

      <section className="relative section-shell render-deferred bg-transparent py-10 sm:py-14">
        <CustomOrderForm
          requestedPiece={requestedPiece}
          requestedProductTitle={requestedProduct?.title || ""}
          guides={guides}
        />
      </section>
    </div>
  )
}

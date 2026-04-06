import dynamic from "next/dynamic"

const CustomOrderForm = dynamic(() => import("@/components/custom-order/CustomOrderForm"), {
  loading: () => <div className="paper-panel min-h-[58rem] rounded-[2rem]" />,
})

export const metadata = {
  title: "Custom Order | Kraftana",
  description: "Start a custom crochet request. Share size, colors, timing, budget, and personal touches.",
}

export default function CustomPage() {
  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell grid gap-8 py-14 sm:py-18 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow">Custom order</p>
            <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.02em] text-[color:var(--foreground)] sm:text-[5.4rem]">
              The fastest way to turn a rough idea into a clear quote.
            </h1>
          </div>

          <div className="paper-panel rounded-[1.7rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--primary)]">
              What to include
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              Send the piece type, size, palette direction, timing, and budget. The response comes
              back as a quote and a short plan before any stitching begins.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell render-deferred py-10 sm:py-14">
        <CustomOrderForm />
      </section>
    </main>
  )
}

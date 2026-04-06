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
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Custom order</p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Let&apos;s shape a handmade piece around your idea.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            Share your size, colors, timing, and budget. The plan gets confirmed before any work
            begins, so the process stays clear and personal.
          </p>
        </div>
      </section>

      <section className="section-shell render-deferred py-10 sm:py-14">
        <CustomOrderForm />
      </section>
    </main>
  )
}

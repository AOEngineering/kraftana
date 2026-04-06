import ShopClient from "@/components/shop/ShopClient"

export const metadata = {
  title: "Shop | Kraftana",
  description: "Browse handmade crochet pieces, slow-made in the studio and available for custom inspiration.",
}

export default function ShopPage() {
  return (
    <main>
      <section className="section-wash border-b border-[color:var(--line-soft)]">
        <div className="section-shell py-14 sm:py-18">
          <p className="eyebrow">Studio collection</p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.94] text-[color:var(--foreground)] sm:text-[4.8rem]">
            Handmade pieces with warmth, texture, and a softer point of view.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-[1.06rem]">
            Browse by category, search by mood, and open Quick View for a closer look at details,
            lead times, and custom-friendly options.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <ShopClient />
      </section>
    </main>
  )
}

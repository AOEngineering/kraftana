import dynamic from "next/dynamic"

import FeatureGallery from "@/components/FeatureGallery"
import HeroIntro from "@/components/HeroIntro"
import SimpleCTA from "@/components/SimpleCTA"

const ShowcaseCarousel = dynamic(() => import("@/components/ShowcaseCarousel"), {
  loading: () => <div className="paper-panel min-h-[32rem] rounded-[2.5rem]" />,
})

const FriendlyProcess = dynamic(() => import("@/components/FriendlyProcess"), {
  loading: () => <div className="section-wash min-h-[38rem] rounded-[2.5rem]" />,
})

export default function Page() {
  return (
    <div className="overflow-x-clip">
      <HeroIntro />

      <section className="section-shell render-deferred py-16 sm:py-24">
        <FeatureGallery />
      </section>

      <section className="section-shell render-deferred pb-16 sm:pb-24">
        <ShowcaseCarousel />
      </section>

      <div className="render-deferred">
        <FriendlyProcess />
      </div>
      <div className="render-deferred">
        <SimpleCTA />
      </div>
    </div>
  )
}

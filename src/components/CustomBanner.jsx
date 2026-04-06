import Link from "next/link"

export default function CustomBanner() {
  return (
    <div className="rounded-3xl border bg-kraft-blush/70 p-8 stitch md:p-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <h3 className="h2-craft text-kraft-forest">Have a vision?</h3>
          <p className="text-kraft-bark/80">
            Tell us size, color, and any personal touches. We will confirm timeline and budget, then begin the magic.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Link href="/custom" className="px-6 py-3 rounded-2xl font-medium shadow-soft text-white" style={{ backgroundColor: "#A57A2C" }}>
            Start custom request
          </Link>
        </div>
      </div>
    </div>
  )
}

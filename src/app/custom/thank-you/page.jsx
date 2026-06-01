"use client"

import Link from "next/link"
import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CustomThankYouContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const requestNumber = searchParams.get("requestNumber") || "Pending"
  const itemType = searchParams.get("itemType") || "Custom piece"
  const category = searchParams.get("category") || ""
  const size = searchParams.get("size") || ""

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">Thank you for your custom order</h1>
      <p className="mt-3 text-sm text-foreground/75">
        Your request was submitted successfully. We will review your details and follow up with a quote.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-black/10 bg-[#faf7f3] p-4 text-sm">
        <p><span className="font-semibold">Request #:</span> {requestNumber}</p>
        <p><span className="font-semibold">Piece:</span> {itemType}</p>
        <p><span className="font-semibold">Category:</span> {category || "N/A"}</p>
        <p><span className="font-semibold">Size:</span> {size || "N/A"}</p>
      </div>

      <p className="mt-5 text-xs text-foreground/65">Redirecting to the homepage in 5 seconds.</p>

      <div className="mt-4">
        <Link href="/" className="inline-flex rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-white">
          Return now
        </Link>
      </div>
    </section>
  )
}

function CustomThankYouFallback() {
  return <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8" />
}

export default function CustomThankYouPage() {
  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6 px-4 py-16 sm:px-6">
      <Suspense fallback={<CustomThankYouFallback />}>
        <CustomThankYouContent />
      </Suspense>
    </main>
  )
}

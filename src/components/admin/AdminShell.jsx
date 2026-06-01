import Link from "next/link"
import { ArrowUpRight, Menu, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/start", label: "Quick Actions" },
      { href: "/admin/analytics", label: "Analytics" },
    ],
  },
  {
    label: "Workflows",
    items: [
      { href: "/admin/requests", label: "Requests" },
      { href: "/admin/messages", label: "Messages" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/media", label: "Media Library" },
      { href: "/admin/testimonials", label: "Testimonials" },
    ],
  },
  {
    label: "Create",
    items: [
      { href: "/admin/wizard/product", label: "Add Shop Item" },
      { href: "/admin/wizard/gallery", label: "Add Gallery Piece" },
      { href: "/admin/wizard/site-info", label: "Site Info Wizard" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings" },
      { href: "/", label: "Preview Site" },
    ],
  },
]

function AdminNav() {
  return (
    <nav className="mt-5 grid gap-2">
      {navSections.map((section, index) => (
        <details
          key={section.label}
          className="rounded-[1.3rem] border border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.38)]"
          open={index < 2}
        >
          <summary className="cursor-pointer list-none px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/48">
            {section.label}
          </summary>
          <div className="grid gap-2 px-3 pb-3">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="admin-soft-card rounded-[1.2rem] px-4 py-3.5 text-sm text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:border-[rgba(145,90,81,0.2)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      ))}
      <Link
        href="/admin/logout"
        className="rounded-[1.2rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 py-3.5 text-sm text-foreground/70 transition hover:border-[rgba(145,90,81,0.24)] hover:bg-[color:var(--surface-3)] hover:text-foreground"
      >
        Log out
      </Link>
    </nav>
  )
}

export default function AdminShell({ title, description, children }) {
  return (
    <main className="admin-shell py-6 sm:py-8 lg:py-10">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden admin-surface rounded-[2.2rem] p-5 xl:sticky xl:top-24 xl:block xl:self-start">
          <div className="px-2 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
              Admin
            </p>
            <h1 className="mt-3 font-display text-[2.35rem] leading-none text-[color:var(--foreground)]">
              Kraftana Studio
            </h1>
            <p className="mt-3 text-sm leading-7 text-foreground/66">
              A calm place to manage products, photos, requests, and feedback.
            </p>
          </div>

          <AdminNav />

          <div className="mt-6 rounded-[1.5rem] border border-[rgba(145,90,81,0.12)] bg-[rgba(255,255,255,0.46)] px-4 py-4 text-sm text-foreground/68">
            <div className="flex items-center gap-2 font-medium text-[color:var(--foreground)]">
              <Sparkles className="h-4 w-4 text-[color:var(--primary)]" />
              Before sharing
            </div>
            <p className="mt-2 leading-7">
              Add a few clear pieces, check the custom form, and make sure the mobile storefront still feels inviting.
            </p>
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="admin-surface flex items-center justify-between rounded-[2rem] p-4 xl:hidden">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                Studio manager
              </p>
              <h1 className="mt-1 font-display text-[2rem] leading-none text-[color:var(--foreground)]">
                Kraftana Studio Admin
              </h1>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" className="h-11 rounded-full px-4">
                  <Menu className="mr-2 h-4 w-4" />
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm border-[color:var(--line-soft)] bg-[color:var(--surface-2)] p-0">
                <SheetHeader className="border-b border-[color:var(--line-soft)] px-6 py-5 text-left">
                  <SheetTitle className="font-display text-3xl text-[color:var(--foreground)]">
                    Kraftana Studio
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <AdminNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <header className="admin-surface rounded-[2.2rem] p-6 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                  Admin workspace
                </p>
                <h2 className="mt-3 font-display text-[2.35rem] leading-none text-[color:var(--foreground)] sm:text-[2.75rem]">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-4 max-w-3xl text-[15px] leading-7 text-foreground/68">
                    {description}
                  </p>
                ) : null}
              </div>

              <Link
                href="/"
                className="admin-soft-card inline-flex h-12 items-center justify-center rounded-full px-5 text-sm text-[color:var(--foreground)]"
              >
                View storefront
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  )
}

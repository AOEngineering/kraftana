"use client"

import { HeartHandshake, PackageCheck, PencilRuler } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const notes = [
  {
    icon: PencilRuler,
    title: "A collaborative beginning",
    copy: "You share the shape, size, color, and feel you want. Even a rough note is enough to start well.",
  },
  {
    icon: HeartHandshake,
    title: "Clear communication",
    copy: "Timelines, pricing, and adjustments are discussed plainly so the process stays warm, not vague.",
  },
  {
    icon: PackageCheck,
    title: "Wrapped with care",
    copy: "Finished pieces are packed thoughtfully with care notes and gift-ready details when needed.",
  },
]

const steps = [
  {
    value: "step-1",
    title: "Share the idea and the feeling",
    content:
      "A quick note about the piece, timing, and palette is enough to begin. Reference photos help, but polished inspiration is never required.",
  },
  {
    value: "step-2",
    title: "We shape the details together",
    content:
      "Once the look and timeline feel right, the plan is confirmed and the stitching begins with updates when the piece needs them.",
  },
  {
    value: "step-3",
    title: "It arrives ready to keep or gift",
    content:
      "Every finished piece is packed gently, with simple care guidance included so it stays beautiful long after delivery.",
  },
]

export default function FriendlyProcess() {
  return (
    <section className="section-wash relative overflow-hidden border-y border-[color:var(--line-soft)]">
      <div className="absolute left-[6%] top-[12%] h-36 w-36 rounded-full bg-[rgba(194,122,90,0.12)] blur-3xl" />
      <div className="absolute right-[10%] bottom-[12%] h-40 w-40 rounded-full bg-[rgba(120,150,173,0.12)] blur-3xl" />

      <div className="section-shell grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-4 max-w-[12ch] font-display text-4xl leading-[0.94] text-[color:var(--foreground)] sm:text-5xl">
            The process should feel thoughtful, not transactional.
          </h2>
          <p className="mt-5 text-[1.02rem] leading-8 text-foreground/76">
            This is handmade work, so the process matters almost as much as the finished piece. The
            goal is clarity, warmth, and enough collaboration to make the result feel personal.
          </p>

          <div className="mt-8 grid gap-4">
            {notes.map((note, index) => {
              const Icon = note.icon

              return (
                <div
                  key={note.title}
                  className={`paper-panel rounded-[1.6rem] p-5 ${index === 1 ? "lg:ml-6" : index === 2 ? "lg:ml-12" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-3)] text-[color:var(--chart-4)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[color:var(--foreground)]">{note.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-foreground/74">{note.copy}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="paper-panel rounded-[2.2rem] p-4 sm:p-5">
          <div className="rounded-[1.7rem] border border-[rgba(120,150,173,0.14)] bg-[color:var(--surface-1)] p-4 sm:p-5">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {steps.map((step, index) => (
                <AccordionItem
                  key={step.value}
                  value={step.value}
                  className="overflow-hidden rounded-[1.45rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-5"
                >
                  <AccordionTrigger className="py-5 text-base font-semibold text-[color:var(--foreground)] no-underline hover:no-underline">
                    <span className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(120,150,173,0.16)] text-[12px] font-semibold text-[color:var(--chart-4)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-[3.5rem] text-sm leading-7 text-foreground/74">
                    {step.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

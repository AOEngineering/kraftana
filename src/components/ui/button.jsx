import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-[0.01em] transition-[transform,box-shadow,background-color,border-color,color] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/70",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#b7776d,#915a51)] text-primary-foreground shadow-[0_16px_40px_rgba(145,90,81,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(145,90,81,0.3)]",
        destructive:
          "bg-destructive text-white shadow-[0_16px_36px_rgba(180,90,84,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(180,90,84,0.32)]",
        outline:
          "border border-[color:var(--line-soft)] bg-white/78 text-foreground shadow-[0_12px_28px_rgba(87,56,47,0.07)] hover:-translate-y-0.5 hover:border-[rgba(145,90,81,0.24)] hover:bg-white/92 hover:shadow-[0_16px_36px_rgba(87,56,47,0.12)]",
        secondary:
          "bg-[rgba(242,223,220,0.88)] text-secondary-foreground shadow-[0_12px_28px_rgba(146,102,95,0.12)] hover:-translate-y-0.5 hover:bg-[rgba(239,213,209,0.96)]",
        ghost:
          "text-foreground/78 hover:bg-[rgba(255,255,255,0.56)] hover:text-foreground",
        link: "rounded-none px-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 px-4 text-[13px] has-[>svg]:px-3",
        lg: "h-12 px-6 text-[15px] has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }

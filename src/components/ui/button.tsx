import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding font-sans text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — indigo (Carel system §02)
        default: "bg-indigo text-white hover:bg-indigo-700",
        // Secondary — indigo outline
        outline:
          "border-indigo text-indigo bg-transparent hover:bg-paper-2",
        secondary:
          "border-indigo text-indigo bg-transparent hover:bg-paper-2",
        // Ghost — quiet
        ghost: "bg-transparent text-ink hover:bg-paper-2",
        // Spark — brick, used sparingly
        spark: "bg-brick text-white hover:bg-brick-700",
        // Destructive — outline danger
        destructive:
          "border-destructive text-destructive bg-transparent hover:bg-destructive/10",
        link: "text-indigo underline-offset-4 hover:underline",
      },
      size: {
        // Phones get a 52px button with 16px text: an easy thumb target that
        // reads as an invitation. From sm up it settles to the desktop size.
        default: "h-13 px-6 text-body sm:h-10 sm:px-[18px] sm:py-2.5 sm:text-sm",
        sm: "h-8 px-[13px] text-cap",
        lg: "h-14 px-7 text-body sm:h-12 sm:px-6",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

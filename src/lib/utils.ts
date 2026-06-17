import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The Carel type scale (globals.css @theme) adds custom `text-*` font-size
 * tokens — text-display/h1/h2/h3/lg/body/sm/cap/micro. tailwind-merge doesn't
 * know these are sizes, so by default it treats e.g. `text-body` as a *color*
 * and drops a real color set alongside it (`text-white text-body` → white gets
 * stripped, the element inherits ink). Registering them as font-sizes keeps
 * size and color in separate groups so both survive.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "lg",
            "body",
            "sm",
            "cap",
            "micro",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

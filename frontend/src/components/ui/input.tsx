import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "outline" 
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type,variant="default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-0 focus-visible:border-orange disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-transparent dark:placeholder:text-slate-400 dark:focus-visible:ring-orange dark:focus-visible:border-orange",
          variant === "outline" && "border-[1px] border-black rounded-full focus-visible:outline-none focus-visible:ring-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

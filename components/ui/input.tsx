import * as React from "react"
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 ${className}`} {...props} />
))
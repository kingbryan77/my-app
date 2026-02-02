import * as React from "react"
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button ref={ref} className={`rounded-md bg-black text-white p-2 ${className}`} {...props} />
))
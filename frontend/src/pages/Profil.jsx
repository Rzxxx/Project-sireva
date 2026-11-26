import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, KeyRound, Phone, Calendar, Hash } from 'lucide-react';

export default function Profil() {
  const { user, setUser } = useContext(AuthContext);

  if (!user) {
    return <div>Memuat profil...</div>;
  }

  return <ProfilForm key={user.id} user={user} setUser={setUser} />;
}

  function ProfilForm({ user, setUser }) {

  // State Akun & Password
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthDate, setBirthDate] = useState(user?.birth_date || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [identityNumber, setIdentityNumber] = useState(user?.identity_number || '');
  const [infoMsg, setInfoMsg] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (infoMsg.text) {
      const timer = setTimeout(() => setInfoMsg({ type: '', text: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [infoMsg]);

  useEffect(() => {
    if (passMsg.text) {
      const timer = setTimeout(() => setPassMsg({ type: '', text: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [passMsg]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoMsg({ type: '', text: '' });
    try {
      const res = await api.put('/profile', { 
        name,
        email,
        birth_date: birthDate || null, 
        phone_number: phoneNumber || null,
        identity_number: identityNumber || null,
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setInfoMsg({ type: 'success', text: 'Informasi profil berhasil disimpan.' });
    } catch (err) {
      setInfoMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan profil' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    
    if (newPassword !== confirmPassword) {
      return setPassMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok' });
    }

    try {
      await api.put('/profile/password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      setPassMsg({ type: 'success', text: 'Password berhasil diubah.' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Gagal mengubah password' });
    }
  };

  const userRole = user?.roles?.[0];
    let idLabel = 'Nomor Identitas';
    if (userRole === 'Mahasiswa') idLabel = 'NIM (Nomor Induk Mahasiswa)';
    if (userRole === 'Dosen') idLabel = 'NIP (Nomor Induk Pegawai)';
    if (userRole === 'Admin' || userRole === 'Petugas') idLabel = 'NIK (Nomor Induk Karyawan)';

  const currentRole = user?.roles?.[0] || 'User';
    let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';
    let iconStyle = 'text-slate-500';

    if (currentRole === 'Admin') {
      badgeStyle = 'bg-rose-50 text-rose-600 border border-rose-100';
      iconStyle = 'text-rose-500';
    } else if (currentRole === 'Petugas') {
      badgeStyle = 'bg-orange-50 text-orange-600 border border-orange-100';
      iconStyle = 'text-orange-500';
    } else if (currentRole === 'Mahasiswa') {
      badgeStyle = 'bg-sky-50 text-sky-600 border border-sky-100';
      iconStyle = 'text-sky-500';
    } else if (currentRole === 'Dosen') {
      badgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      iconStyle = 'text-emerald-500';
    }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi akun dan keamanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KARTU IDENTITAS (KIRI) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-fit shadow-sm">
          <div className="w-28 h-28 bg-orange-400 rounded-full flex items-center justify-center text-[#1E293B] text-5xl font-extrabold mb-5 shadow-lg shadow-orange-500/30">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E293B] mb-1">{user?.name}</h2>
          <p className="text-slate-500 text-sm mb-4 font-medium">{user?.email}</p>
          
          <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm ${badgeStyle}`}>
            <ShieldCheck size={14} className={iconStyle} />
            {currentRole}
          </span>
        </div>

        {/* FORM (KANAN) */}
        <div className="lg:col-span-2 space-y-6">
          {/* FORM INFO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#1E293B] mb-5 flex items-center gap-2">
              <User size={20} className="text-orange-500"/> Informasi Akun
            </h3>
            
            <AnimatePresence>
              {infoMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`p-3 rounded-xl text-sm overflow-hidden font-medium border ${
                    infoMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}
                >
                  {infoMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Alamat Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{idLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={identityNumber} 
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      placeholder="Masukkan nomor identitas..."
                      className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nomor Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08123456789"
                      className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal Lahir</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      value={birthDate} 
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/30 transition-colors"
                >
                  Simpan Perubahan
                </motion.button>
              </div>
            </form>
          </div>

          {/* FORM PASSWORD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#1E293B] mb-5 flex items-center gap-2">
              <KeyRound size={20} className="text-slate-800"/> Ubah Password
            </h3>

            <AnimatePresence>
              {passMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`p-3 rounded-xl text-sm overflow-hidden font-medium border ${
                    passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}
                >
                  {passMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password Saat Ini</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  required
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all font-medium" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password Baru</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength="6"
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    minLength="6"
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
                >
                  Ubah Password
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

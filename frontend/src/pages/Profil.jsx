import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import { User, Shield, KeyRound } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Profil() {
  const { user, setUser } = useContext(AuthContext);
  
  // State Info Akun
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [infoMsg, setInfoMsg] = useState({ type: '', text: '' });

  // State Password
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
      const res = await api.put('/profile', { name, email });
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profil Saya</h1>
        <p className="text-gray-400">Kelola informasi akun dan keamanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KARTU IDENTITAS (KIRI) */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8 flex flex-col items-center justify-center text-center h-fit shadow-lg">
          <div className="w-24 h-24 bg-[#a3d977] rounded-full flex items-center justify-center text-black text-4xl font-bold mb-4 shadow-lg shadow-[#a3d977]/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
          <span className="bg-gray-800 text-[#a3d977] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Shield size={14} />
            {user?.roles?.[0] || 'User'}
          </span>
        </div>

        {/* FORM (KANAN) */}
        <div className="lg:col-span-2 space-y-6">
          {/* FORM INFO */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-[#a3d977]"/> Informasi Akun
            </h3>
            
            <AnimatePresence>
              {infoMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`p-3 rounded-lg text-sm overflow-hidden ${infoMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                >
                  {infoMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-[#a3d977] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alamat Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-[#a3d977] outline-none transition-colors" />
              </div>
              <button type="submit" className="bg-[#a3d977] hover:bg-[#8fc766] text-black font-bold py-2.5 px-6 rounded-lg transition-colors">
                Simpan Perubahan
              </button>
            </form>
          </div>

          {/* FORM PASSWORD */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <KeyRound size={18} className="text-yellow-400"/> Ubah Password
            </h3>

            <AnimatePresence>
              {infoMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`p-3 rounded-lg text-sm overflow-hidden ${infoMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                >
                  {infoMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password Saat Ini</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-yellow-400 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password Baru</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6"
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-yellow-400 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Konfirmasi Password Baru</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6"
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-yellow-400 outline-none transition-colors" />
                </div>
              </div>
              <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors border border-gray-700">
                Ubah Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
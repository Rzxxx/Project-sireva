
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { ShieldCheck, Plus, X, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pengguna() {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const [filterRole, setFilterRole] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Mahasiswa',
    identity_number: ''
  });

  const [modalError, setModalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Gagal mengambil data user', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };

  loadData();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, {
        role: newRole
      });

      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message || 'Gagal mengubah role'
      );
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await api.delete(`/users/${id}`);
        await fetchUsers();
        setSuccessMsg('Pengguna berhasil dihapus!');
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus pengguna');
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    setModalError('');

    try {
      await api.post('/users', formData);

      setIsModalOpen(false);

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Mahasiswa'
      });

      await fetchUsers();

      setSuccessMsg('Pengguna baru berhasil ditambahkan!');
    } catch (err) {
      setModalError(
        err.response?.data?.message ||
        'Gagal menambahkan pengguna. Periksa kembali data Anda.'
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'Semua') return true;
    const userRole = u.roles && u.roles.length > 0 ? u.roles[0].name : 'Tanpa Role';
    return userRole === filterRole;
  });

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">Kelola Pengguna</h1>
          <p className="text-slate-500">Atur peran (role) dan hak akses pengguna SIREVA.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* FILTER ROLE */}
          <div className="relative w-full sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full bg-white text-slate-700 font-semibold border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer shadow-sm appearance-none"
            >
              <option value="Semua">Semua Role</option>
              <option value="Admin">Admin</option>
              <option value="Petugas">Petugas</option>
              <option value="Dosen">Dosen</option>
              <option value="Mahasiswa">Mahasiswa</option>
            </select>
            {/* Custom Arrow untuk Select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* TOMBOL TAMBAH */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setModalError(''); setIsModalOpen(true); }}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all whitespace-nowrap"
          >
            <Plus size={18} /> Tambah
          </motion.button>
        </div>
      </div>

      {/* NOTIFIKASI SUKSES */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 flex items-center gap-2 border border-emerald-100 font-medium"
          >
            <CheckCircle2 size={20} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABEL PENGGUNA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Nama Pengguna</th>
                <th className="px-6 py-4 font-bold">Email & ID</th>
                <th className="px-6 py-4 font-bold">Role Saat Ini</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 animate-pulse font-medium">Memuat data...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-medium">Tidak ada pengguna dengan role ini.</td></tr>
              ) : (
                filteredUsers.map((u, index) => {
                  const userRole = u.roles && u.roles.length > 0 ? u.roles[0].name : 'Tanpa Role';
                  const isSelf = u.id === currentUser?.id;

                  let badgeStyle = 'bg-slate-100 text-slate-600';
                  if (userRole === 'Admin') badgeStyle = 'bg-rose-50 text-rose-600 border border-rose-100';
                  if (userRole === 'Petugas') badgeStyle = 'bg-orange-50 text-orange-600 border border-orange-100';
                  if (userRole === 'Mahasiswa') badgeStyle = 'bg-sky-50 text-sky-600 border border-sky-100';
                  if (userRole === 'Dosen') badgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* NAMA */}
                      <td className="px-6 py-4 font-bold text-[#1E293B]">
                        <div className="flex items-center gap-2">
                          {u.name}
                          {isSelf && (
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Anda</span>
                          )}
                        </div>
                      </td>

                      {/* EMAIL & IDENTITAS */}
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        <div>{u.email}</div>
                        <div className="text-xs text-slate-400 font-bold">{u.identity_number || '-'}</div>
                      </td>

                      {/* ROLE BADGE */}
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 w-max px-3 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
                          <ShieldCheck size={14} /> {userRole}
                        </span>
                      </td>

                      {/* AKSI (UBAH ROLE & HAPUS) */}
                      <td className="px-6 py-4 text-center">
                        {!isSelf ? (
                          <div className="flex items-center justify-center gap-3">
                            <select
                              value={userRole}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                            >
                              <option value="Mahasiswa">Mahasiswa</option>
                              <option value="Dosen">Dosen</option>
                              <option value="Petugas">Petugas</option>
                              <option value="Admin">Admin</option>
                            </select>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="text-rose-500 hover:text-rose-600 p-2.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Hapus Pengguna"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm font-medium italic">Tidak dapat diubah</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">Tambah Pengguna Baru</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-50 text-rose-500 p-3 rounded-lg mb-5 text-sm flex gap-2 items-center border border-rose-100 font-medium">
                  <AlertCircle size={16}/> {modalError}
                </motion.div>
              )}

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Alamat Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" placeholder="nama@sireva.ac.id" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nomor Identitas (NIM/NIP/NIK)</label>
                  <input 
                    type="text" 
                    value={formData.identity_number} 
                    onChange={(e) => setFormData({ ...formData, identity_number: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="Ketik nomor identitas disini..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                  <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium" placeholder="Min. 8 karakter" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Role / Peran</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer font-medium">
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Dosen">Dosen</option>
                    <option value="Petugas">Petugas</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 transition-colors">
                    Simpan Pengguna
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

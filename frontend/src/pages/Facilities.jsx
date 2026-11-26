import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', type: 'Ruang Kelas', description: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Petugas');

  const fetchFacilities = async () => {
    try {
      const response = await api.get('/facilities');
      setFacilities(response.data);
    } catch (err) {
      console.error("Gagal mengambil data fasilitas", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
        await fetchFacilities();
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/facilities', { ...formData, is_active: true });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'Ruang Kelas', description: '' });
      fetchFacilities();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus fasilitas ini?')) {
      try {
        await api.delete(`/facilities/${id}`);
        fetchFacilities();
      } catch {
        alert('Gagal menghapus fasilitas');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">Kelola Ruangan</h1>
          <p className="text-slate-500">Atur daftar fasilitas kampus yang dapat dipinjam.</p>
        </div>
        {canManage && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all"
          >
            <Plus size={18} /> Tambah Fasilitas
          </motion.button>
        )}
      </div>

      {/* Tabel Data - Tema Terang */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Nama Fasilitas</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold">Status</th>
                {canManage && <th className="px-6 py-4 font-bold text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 animate-pulse font-medium">Memuat data...</td></tr>
              ) : facilities.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-medium">Belum ada data fasilitas.</td></tr>
              ) : (
                facilities.map((facility, index) => (
                  <motion.tr 
                    key={facility.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-[#1E293B]">{facility.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 py-1.5 px-3 rounded-full text-xs font-bold">
                        {facility.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${facility.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {facility.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(facility.id)} 
                          className="text-rose-500 hover:text-rose-600 p-2 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH FASILITAS - Tema Terang */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Aksen garis atas Orange */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">Tambah Fasilitas</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-rose-50 text-rose-500 p-3 rounded-lg mb-5 text-sm flex gap-2 items-center border border-rose-100"
                >
                  <AlertCircle size={16}/> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nama Fasilitas</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                    placeholder="Contoh: Lab Komputer 301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                  <select 
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="Ruang Kelas">Ruang Kelas</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Aula">Aula</option>
                    <option value="Lapangan">Lapangan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi (Opsional)</label>
                  <textarea 
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                    placeholder="Kapasitas 30 orang, ada AC..."
                    rows="2"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 transition-colors"
                  >
                    Simpan
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

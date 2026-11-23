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
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kelola Ruangan</h1>
          <p className="text-gray-400">Atur daftar fasilitas kampus yang dapat dipinjam.</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#a3d977] hover:bg-[#8fc766] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Tambah Fasilitas
          </button>
        )}
      </div>

      {/* Tabel Data */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#121212] text-gray-400 text-sm border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Fasilitas</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {canManage && <th className="px-6 py-4 font-medium text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-8">Memuat data...</td></tr>
            ) : facilities.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Belum ada data fasilitas.</td></tr>
            ) : (
              facilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-[#222] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{facility.name}</td>
                  <td className="px-6 py-4"><span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs">{facility.type}</span></td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${facility.is_active ? 'text-green-400' : 'text-red-400'}`}>
                      {facility.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(facility.id)} className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH FASILITAS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a1a] w-full max-w-md rounded-xl border border-gray-800 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Tambah Fasilitas</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>

              {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm flex gap-2 items-center"><AlertCircle size={16}/> {error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nama Fasilitas</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-2.5 focus:border-green-500 outline-none"
                    placeholder="Contoh: Lab Komputer 1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Kategori</label>
                  <select 
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-2.5 focus:border-green-500 outline-none"
                  >
                    <option value="Ruang Kelas">Ruang Kelas</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Aula">Aula</option>
                    <option value="Lapangan">Lapangan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Deskripsi (Opsional)</label>
                  <textarea 
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-2.5 focus:border-green-500 outline-none"
                    placeholder="Kapasitas 30 orang, ada AC..."
                    rows="2"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                  <button type="submit" className="bg-[#a3d977] hover:bg-[#8fc766] text-black font-bold px-6 py-2 rounded-lg">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
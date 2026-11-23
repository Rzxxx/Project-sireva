import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

export default function Pengajuan() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal Reject
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  const fetchPending = async () => {
    try {
      const response = await api.get('/bookings/pending');
      setBookings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
        await fetchPending();
    };
    loadData();
  }, []);

  // Fungsi Approve
  const handleApprove = async (id) => {
    if (window.confirm('Setujui peminjaman ini?')) {
      try {
        await api.put(`/bookings/${id}/process`, { action: 'approve' });
        fetchPending();
      } catch {
        alert('Gagal menyetujui peminjaman');
      }
    }
  };

  // Fungsi Buka Modal Reject
  const openRejectModal = (id) => {
    setSelectedBookingId(id);
    setRejectReason('');
    setError('');
    setIsRejectModalOpen(true);
  };

  // Fungsi Submit Reject
  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setError('Alasan penolakan wajib diisi!');
      return;
    }
    try {
      await api.put(`/bookings/${selectedBookingId}/process`, { 
        action: 'reject', 
        rejection_reason: rejectReason 
      });
      setIsRejectModalOpen(false);
      fetchPending();
    } catch {
      setError('Gagal menolak peminjaman');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Persetujuan Peminjaman</h1>
        <p className="text-gray-400">Daftar pengajuan peminjaman yang menunggu persetujuan Anda.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#121212] text-gray-400 text-sm border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Peminjam</th>
              <th className="px-6 py-4 font-medium">Fasilitas & Waktu</th>
              <th className="px-6 py-4 font-medium">Keperluan</th>
              <th className="px-6 py-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-8">Memuat data...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada pengajuan yang menunggu persetujuan.</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#222] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{booking.user.name}</p>
                    <p className="text-xs text-gray-500">{booking.participants} Peserta</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#a3d977]">{booking.facility.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.start_time).toLocaleDateString('id-ID')} |
                      {new Date(booking.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - 
                      {new Date(booking.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate" title={booking.purpose}>
                    {booking.purpose}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleApprove(booking.id)} className="bg-green-500/10 text-green-400 hover:bg-green-500/20 p-2 rounded-lg transition-colors" title="Setujui">
                        <Check size={18} />
                      </button>
                      <button onClick={() => openRejectModal(booking.id)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors" title="Tolak">
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL REJECT */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a1a] w-full max-w-md rounded-xl border border-gray-800 p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Tolak Peminjaman</h2>
                <button onClick={() => setIsRejectModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>

              {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm flex gap-2 items-center"><AlertCircle size={16}/> {error}</div>}

              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Alasan Penolakan (Wajib)</label>
                  <textarea required rows="3" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-red-500 outline-none" 
                    placeholder="Contoh: Ruangan dipakai untuk Ujian Akhir Semester..." />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                  <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg">Tolak Pengajuan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
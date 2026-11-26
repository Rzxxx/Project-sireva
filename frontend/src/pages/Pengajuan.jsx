import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, FileText } from 'lucide-react';
export default function Pengajuan() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal Reject
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  // Modal Approve
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveBookingId, setApproveBookingId] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState('');

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
  const openApproveModal = (id) => {
    setApproveBookingId(id);
    setApprovalMessage('');
    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${approveBookingId}/process`, { 
        action: 'approve',
        approval_message: approvalMessage 
      });
      setIsApproveModalOpen(false);
      fetchPending();
    } catch {
      alert('Gagal menyetujui peminjaman');
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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl">
      
      {/* HEADER HALAMAN */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">Persetujuan Peminjaman</h1>
        <p className="text-slate-500">Daftar pengajuan peminjaman yang menunggu persetujuan Anda.</p>
      </div>

      {/* KARTU TABEL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Peminjam</th>
                <th className="px-6 py-4 font-bold">Fasilitas & Waktu</th>
                <th className="px-6 py-4 font-bold">Keperluan</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 animate-pulse font-medium">Memuat data...</td></tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">
                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                    Tidak ada pengajuan yang menunggu persetujuan.
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <motion.tr 
                    key={booking.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1E293B]">{booking.user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{booking.participants} Peserta</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-orange-500 mb-1">{booking.facility.name}</p>
                      <div className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                        {new Date(booking.start_time).toLocaleDateString('id-ID')} 
                        <span className="text-slate-300">|</span>
                        {new Date(booking.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(booking.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-[200px] truncate font-medium" title={booking.purpose}>
                      {booking.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openApproveModal(booking.id)} 
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2.5 rounded-xl transition-colors" 
                          title="Setujui"
                        >
                          <Check size={18} strokeWidth={3} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openRejectModal(booking.id)} 
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-2.5 rounded-xl transition-colors" 
                          title="Tolak"
                        >
                          <X size={18} strokeWidth={3} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REJECT - Tema Terang */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Aksen Garis Atas Rose */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">Tolak Peminjaman</h2>
                <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20}/>
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-rose-50 text-rose-500 p-3 rounded-lg mb-5 text-sm flex gap-2 items-center border border-rose-100 font-medium"
                >
                  <AlertCircle size={16}/> {error}
                </motion.div>
              )}

              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Alasan Penolakan (Wajib)</label>
                  <textarea 
                    required 
                    rows="3" 
                    value={rejectReason} 
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="Ketik alasan penolakan disini..." 
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsRejectModalOpen(false)} 
                    className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-rose-500/30 transition-colors"
                  >
                    Tolak Pengajuan
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL APPROVE - Tema Hijau */}
      <AnimatePresence>
        {isApproveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Aksen Garis Atas Hijau */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">Setujui Peminjaman</h2>
                <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleApproveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Tambahkan Pesan (Opsional)</label>
                  <textarea 
                    rows="3" 
                    value={approvalMessage} 
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="Ketik pesan disini..." 
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsApproveModalOpen(false)} 
                    className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-colors"
                  >
                    Setujui Pengajuan
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

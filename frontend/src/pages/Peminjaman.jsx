import { useState, useEffect } from "react";
import api from "../lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle, CheckCircle2, X, Users, FileText, Info } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Peminjaman() {
  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  // State Form
  const [formData, setFormData] = useState({
    facility_id: "",
    date: "",
    start_time: "",
    end_time: "",
    participants: "",
    purpose: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // State Cancel Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch data
  const fetchData = async () => {
    try {
      const [facRes, bookRes] = await Promise.all([
        api.get("/facilities"),
        api.get("/my-bookings"),
      ]);
      setFacilities(facRes.data);
      setMyBookings(bookRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const payload = {
      facility_id: formData.facility_id,
      start_time: `${formData.date} ${formData.start_time}:00`,
      end_time: `${formData.date} ${formData.end_time}:00`,
      participants: parseInt(formData.participants),
      purpose: formData.purpose,
    };

    try {
      await api.post("/bookings", payload);
      setMessage({
        type: "success",
        text: "Peminjaman berhasil diajukan! Menunggu persetujuan petugas.",
      });
      setFormData({
        facility_id: "",
        date: "",
        start_time: "",
        end_time: "",
        participants: "",
        purpose: "",
      });
      fetchData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Gagal mengajukan peminjaman",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${cancelBookingId}/cancel`, {
        reason: cancelReason,
      });
      setIsCancelModalOpen(false);
      setCancelReason("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl flex flex-col lg:flex-row gap-8 items-start"
    >
      {/* KOLOM KIRI: FORM PENGAJUAN */}
      <div className="flex-1 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">
            Form Reservasi
          </h1>
          <p className="text-slate-500">
            Ajukan peminjaman ruangan atau fasilitas kampus.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {/* Notifikasi */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`p-4 rounded-xl text-sm overflow-hidden flex items-center gap-2 font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Pilih Fasilitas
              </label>
              <select
                required
                value={formData.facility_id}
                onChange={(e) =>
                  setFormData({ ...formData, facility_id: e.target.value })
                }
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer font-medium"
              >
                <option value="">-- Pilih Ruangan --</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Tanggal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Jumlah Peserta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.participants}
                    onChange={(e) =>
                      setFormData({ ...formData, participants: e.target.value })
                    }
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                    placeholder="Cth: 30"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Jam Mulai
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Jam Selesai
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Alasan Peminjaman
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText size={18} className="text-slate-400" />
                </div>
                <textarea
                  required
                  rows="3"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="Ketik keperluan peminjaman di sini..."
                ></textarea>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-colors flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Ajukan Peminjaman"
              )}
            </motion.button>
          </form>
        </div>
      </div>

      {/* KOLOM KANAN: RIWAYAT PEMINJAMAN */}
      <div className="flex-1 w-full">
        <h2 className="text-xl font-extrabold text-[#1E293B] mb-4 tracking-tight">
          Riwayat Peminjaman
        </h2>
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                Belum ada riwayat peminjaman.
              </p>
            </div>
          ) : (
            myBookings.map((booking, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={booking.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow group"
              >
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">
                    {booking.facility.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(booking.start_time).toLocaleDateString("id-ID")}
                    <span className="text-slate-300 mx-1">|</span>
                    <Clock size={14} className="text-slate-400" />
                    {new Date(booking.start_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <span className="mx-0.5">-</span>
                    {new Date(booking.end_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* KOLOM KANAN (STATUS, ALASAN, TOMBOL) */}
                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wider font-extrabold uppercase
                      ${
                        booking.status === "approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : booking.status === "pending"
                            ? "bg-sky-50 text-sky-600 border border-sky-100"
                            : booking.status === "cancelled"
                              ? "bg-slate-100 text-slate-500 border border-slate-200"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                  >
                    {booking.status}
                  </span>

                  {booking.rejection_reason && (
                    <span
                      className="text-xs text-rose-500 max-w-[180px] text-left sm:text-right truncate font-medium"
                      title={booking.rejection_reason}
                    >
                      Alasan: {booking.rejection_reason}
                    </span>
                  )}

                  <div className="flex items-center gap-4 mt-1">
                    {/* TOMBOL LIHAT DETAIL */}
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-xs text-slate-600 hover:text-orange-500 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Info size={14} /> Lihat Detail
                    </button>

                    {/* TOMBOL BATALKAN */}
                    {(booking.status === "pending" ||
                      booking.status === "approved") && (
                      <button
                        onClick={() => {
                          setCancelBookingId(booking.id);
                          setIsCancelModalOpen(true);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold underline transition-colors"
                      >
                        Batalkan Peminjaman
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MODAL CANCEL */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">
                  Batalkan Peminjaman
                </h2>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Alasan Pembatalan (Wajib)
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-medium"
                    placeholder="Tulis alasan pembatalan di sini..."
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Kembali
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-rose-500/30 transition-colors"
                  >
                    Batalkan
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL LIHAT DETAIL */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Aksen Garis Atas Berdasarkan Status */}
              <div
                className={`absolute top-0 left-0 w-full h-1.5 ${
                  selectedBooking.status === "approved"
                    ? "bg-emerald-500"
                    : selectedBooking.status === "rejected"
                      ? "bg-rose-500"
                      : selectedBooking.status === "cancelled"
                        ? "bg-slate-400"
                        : "bg-sky-500"
                }`}
              ></div>

              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-extrabold text-[#1E293B]">
                  Detail Peminjaman
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">
                    Fasilitas
                  </p>
                  <p className="font-extrabold text-lg text-[#1E293B]">
                    {selectedBooking.facility.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">
                      Tanggal
                    </p>
                    <p className="font-medium text-slate-800">
                      {new Date(selectedBooking.start_time).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">
                      Waktu
                    </p>
                    <p className="font-medium text-slate-800">
                      {new Date(selectedBooking.start_time).toLocaleTimeString(
                        "id-ID",
                        { hour: "2-digit", minute: "2-digit" },
                      )}{" "}
                      -
                      {new Date(selectedBooking.end_time).toLocaleTimeString(
                        "id-ID",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">
                    Jumlah Peserta
                  </p>
                  <p className="font-medium text-slate-800">
                    {selectedBooking.participants} Orang
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">
                    Keperluan
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 text-sm">
                    {selectedBooking.purpose}
                  </div>
                </div>

                {/* KONDISIONAL: Tampilkan Pesan Persetujuan jika APPROVED */}
                {selectedBooking.status === 'approved' && (
                  (() => {
                    const approveLog = selectedBooking.logs?.find(log => log.action === 'approved' && log.notes);
                    if (approveLog) {
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl"
                        >
                          <p className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Pesan
                          </p>
                          <p className="text-sm text-emerald-700 font-medium">
                            "{approveLog.notes}"
                          </p>
                          <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                            <span>Disetujui oleh: {approveLog.user.name}</span>
                            <span className="bg-emerald-200/50 px-2 py-0.5 rounded-md text-[10px] uppercase">
                              {approveLog.user.roles?.[0]?.name || 'Petugas'}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })()
                )}

                {/* KONDISIONAL: Tampilkan Alasan jika REJECTED atau CANCELLED */}
                {(selectedBooking.status === 'rejected' || selectedBooking.status === 'cancelled') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl"
                  >
                    <p className="text-sm font-bold text-rose-600 mb-1 flex items-center gap-1">
                      <AlertCircle size={16} /> 
                      Alasan {selectedBooking.status === 'rejected' ? 'Penolakan' : 'Pembatalan'}
                    </p>
                    <p className="text-sm text-rose-700 font-medium">
                      {/* Ambil alasan dari kolom rejection_reason, ATAU dari catatan log jika dibatalkan */}
                      {selectedBooking.rejection_reason || 
                       selectedBooking.logs?.find(log => log.action === selectedBooking.status)?.notes || 
                       'Tidak ada alasan yang dicatat.'}
                    </p>

                    {/* MENAMPILKAN SIAPA YANG MELAKUKAN AKSI DARI AUDIT LOG */}
                    {(() => {
                      const actionLog = selectedBooking.logs?.find(log => log.action === selectedBooking.status);
                      
                      if (actionLog && actionLog.user) {
                        return (
                          <div className="mt-3 pt-3 border-t border-rose-200 flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                            <span>
                              {selectedBooking.status === 'rejected' ? 'Ditolak' : 'Dibatalkan'} oleh: {actionLog.user.name}
                            </span>
                            <span className="bg-rose-200/50 px-2 py-0.5 rounded-md text-[10px] uppercase">
                              {actionLog.user.roles?.[0]?.name || 'User'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </motion.div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

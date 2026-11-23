import { useState, useEffect } from "react";
import api from "../lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle, CheckCircle2, X } from "lucide-react";
import { AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
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
      }); // Reset
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

  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${cancelBookingId}/cancel`, {
        reason: cancelReason,
      });
      setIsCancelModalOpen(false);
      setCancelReason("");
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan");
    }
  };

  // State untuk Modal Cancel
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  return (
    <div className="max-w-6xl flex flex-col lg:flex-row gap-6">
      {/* KOLOM KIRI: FORM PENGAJUAN */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-2">Form Peminjaman</h1>
        <p className="text-gray-400 mb-6">
          Ajukan peminjaman ruangan atau fasilitas kampus.
        </p>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl">
          {message.text && (

            <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`p-3 rounded-lg text-sm overflow-hidden ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {message.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Pilih Fasilitas
              </label>
              <select
                required
                value={formData.facility_id}
                onChange={(e) =>
                  setFormData({ ...formData, facility_id: e.target.value })
                }
                className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none"
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
                <label className="block text-sm text-gray-400 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Jumlah Peserta
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData({ ...formData, participants: e.target.value })
                  }
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none"
                  placeholder="Cth: 30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  required
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                  className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Keperluan
              </label>
              <textarea
                required
                rows="3"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-green-500 outline-none"
                placeholder="Cth: Rapat Himpunan / Kelas Pengganti"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a3d977] hover:bg-[#8fc766] disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Memproses..." : "Ajukan Peminjaman"}
            </button>
          </form>
        </div>
      </div>

      {/* KOLOM KANAN: RIWAYAT PEMINJAMAN */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-4">
          Riwayat Peminjaman Saya
        </h2>
        <div className="space-y-3">
          {myBookings.length === 0 ? (
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 text-center text-gray-500">
              Belum ada riwayat peminjaman.
            </div>
          ) : (
            myBookings.map((booking) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={booking.id}
                className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-white">
                    {booking.facility.name}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <Calendar size={14} />{" "}
                    {new Date(booking.start_time).toLocaleDateString("id-ID")} |
                    <Clock size={14} />{" "}
                    {new Date(booking.start_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -
                    {new Date(booking.end_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase
    ${
      booking.status === "approved"
        ? "bg-green-500/20 text-green-400"
        : booking.status === "pending"
          ? "bg-yellow-500/20 text-yellow-400"
          : booking.status === "cancelled"
            ? "bg-gray-500/20 text-gray-400"
            : "bg-red-500/20 text-red-400"
    }`}
                  >
                    {booking.status}
                  </span>

                  {/* Tampilkan alasan reject/cancel jika ada */}
                  {booking.rejection_reason && (
                    <span
                      className="text-xs text-red-400 max-w-[150px] text-right truncate"
                      title={booking.rejection_reason}
                    >
                      Alasan: {booking.rejection_reason}
                    </span>
                  )}

                  {/* Tombol Cancel: Hanya muncul jika status masih pending/approved */}
                  {(booking.status === "pending" ||
                    booking.status === "approved") && (
                    <button
                      onClick={() => {
                        setCancelBookingId(booking.id);
                        setIsCancelModalOpen(true);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 underline mt-1"
                    >
                      Batalkan
                    </button>
                  )}
                </div>

                {/* MODAL CANCEL */}
                <AnimatePresence>
                  {isCancelModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#1a1a1a] w-full max-w-md rounded-xl border border-gray-800 p-6 shadow-2xl"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-white">
                            Batalkan Peminjaman
                          </h2>
                          <button
                            onClick={() => setIsCancelModalOpen(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <form onSubmit={handleCancel} className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">
                              Alasan Pembatalan (Wajib)
                            </label>
                            <textarea
                              required
                              rows="3"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="w-full bg-[#121212] text-white border border-gray-700 rounded-lg p-3 focus:border-red-500 outline-none"
                              placeholder="Isi alasan pembatalan disini..."
                            />
                          </div>
                          <div className="pt-2 flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => setIsCancelModalOpen(false)}
                              className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                              Kembali
                            </button>
                            <button
                              type="submit"
                              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg"
                            >
                              Batalkan Booking
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

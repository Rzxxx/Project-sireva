import { useState, useContext } from "react";
import { AuthContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import studentIcon from "../assets/student-icon.avif";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[650px] border border-gray-100"
      >
        {/* SISI KIRI: BRANDING & ILUSTRASI (Campus Daylight) */}
        <div className="hidden md:flex md:w-1/2 bg-[#1E293B] relative flex-col justify-between p-12 overflow-hidden">
          {/* Dekorasi Background Abstrak (Apricot Tint) */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full text-orange-400"
            >
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-full shadow-lg">
              <img
                src="/favicon.svg"
                alt="SIREVA"
                className="w-10 h-10 object-contain"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <span className="text-white font-bold text-2xl tracking-wide">
              SIREVA
            </span>
          </div>

          {/* Teks Sambutan */}
          <div className="relative z-10 text-white mt-12">
            <h2 className="text-4xl font-extrabold mb-6 leading-tight tracking-tight">
              Sistem Reservasi
              <br />
              Fasilitas Kampus 🚀
            </h2>
            <div className="bg-orange-50/10 p-4 rounded-xl border-l-4 border-orange-400">
              <p className="text-orange-50 text-lg font-bold leading-relaxed">
                Reservasi fasilitas kampus dalam satu sistem terpadu yang mudah
                & cepat.
              </p>
            </div>
          </div>

          {/* Ilustrasi Bawah */}
          <div className="relative z-10 mt-auto pt-10">
            <motion.img
              src={studentIcon}
              alt="Ilustrasi Mahasiswa"
              className="w-full max-w-sm mx-auto drop-shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* SISI KANAN: FORM LOGIN */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white">
          <div className="md:hidden flex justify-center items-center gap-2 mb-8">
            <img
              src="/favicon.svg"
              alt="SIREVA"
              className="w-8 h-8 object-contain"
            />
            <span className="text-[#1E293B] font-bold text-xl">SIREVA</span>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">
              Selamat Datang!
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Silakan masuk dengan akun yang diberikan oleh Admin.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-rose-50 text-rose-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-rose-100"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={formVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all font-medium"
                  placeholder="nama@sireva.ac.id"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-bold">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-orange-500 font-bold hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all font-medium"
                  placeholder="Masukkan password Anda"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-orange-400 bg-gray-100 border-gray-300 rounded focus:ring-orange-400"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 font-medium"
              >
                Ingat saya untuk 30 hari
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Masuk"
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <p className="text-center text-sm text-gray-500 mt-10 font-medium">
            Belum punya akun?{" "}
            <span className="text-[#1E293B] font-bold cursor-default">
              Hubungi Admin IT Kampus
            </span>
          </p>

          <footer className="md:absolute md:bottom-6 left-0 right-0 mt-8 md:mt-0 text-center">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              © 2026 SIREVA. All Rights Reserved.
            </p>
          </footer>
          
        </div>
      </motion.div>
    </div>
  );
}

// frontend/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d0d0d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali!</h1>
          <p className="text-gray-400 text-sm">Masukan Informasi Akun Anda</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Alamat Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Masukkan alamat email Anda"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-white text-sm font-medium">Password</label>
              <a href="#" className="text-xs text-blue-400 hover:underline">forgot password</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded bg-[#1a1a1a] border-gray-700" />
            <label className="text-sm text-gray-300">Remember for 30 days</label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#a3d977] hover:bg-[#8fc766] text-black font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <a href="#" className="text-blue-400 hover:underline">Sign Up</a>
        </p>
      </motion.div>
    </div>
  );
}
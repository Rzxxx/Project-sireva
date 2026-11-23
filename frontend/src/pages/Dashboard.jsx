import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import { LayoutGrid, CalendarCheck, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total_facilities: 0, active_bookings: 0, pending_bookings: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  const statCards = [
    { title: 'Total Fasilitas', value: stats.total_facilities, icon: LayoutGrid, color: 'text-blue-400' },
    { title: 'Peminjaman Aktif', value: stats.active_bookings, icon: CalendarCheck, color: 'text-green-400' },
    { title: 'Menunggu Persetujuan', value: stats.pending_bookings, icon: Clock, color: 'text-yellow-400' },
  ];

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Utama</h1>
        <p className="text-gray-400 mb-8">Selamat datang kembali, <span className="text-[#a3d977] font-medium">{user?.name}</span>.</p>
      </motion.div>
      
      {isLoading ? (
        <div className="text-gray-400 animate-pulse">Memuat data statistik...</div>
      ) : (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {statCards.map((card, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-[#1a1a1a]/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between hover:border-gray-600 transition-colors"
            >
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gray-800/50 ${card.color}`}>
                <card.icon size={28} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
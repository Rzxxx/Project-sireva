import { useContext, useState } from 'react';
import { AuthContext } from '../context/context';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, LayoutGrid, Users, LogOut, Menu, BookCheck, BookOpenCheck} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const allMenus = [
    { name: 'Beranda', path: '/dashboard', icon: Home, roles: ['Admin', 'Petugas', 'Mahasiswa', 'Dosen'] },
    { name: 'Reservasi', path: '/dashboard/peminjaman', icon: BookCheck, roles: ['Mahasiswa', 'Dosen'] },
    { name: 'Kelola Ruangan', path: '/dashboard/fasilitas', icon: LayoutGrid, roles: ['Admin'] },
    { name: 'Pengajuan', path: '/dashboard/pengajuan', icon: BookOpenCheck, roles: ['Petugas'] },
    { name: 'Profil', path: '/dashboard/profil', icon: User, roles: ['Admin', 'Petugas', 'Mahasiswa', 'Dosen'] },
    { name: 'Pengguna', path: '/dashboard/pengguna', icon: Users, roles: ['Admin'] },
  ];

  const userRoles = user?.roles || [];
  const filteredMenus = allMenus.filter(menu => 
    menu.roles.some(role => userRoles.includes(role))
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR - Deep Navy */}
      <motion.aside 
        initial={{ width: 250 }}
        animate={{ width: isSidebarOpen ? 250 : 80 }}
        className="bg-[#1E293B] flex flex-col h-full z-20 shadow-xl"
      >
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/50 h-16">
          <img src="/favicon.svg" alt="SIREVA" className="h-8 object-contain" onError={(e) => e.target.style.display = 'none'} />
          {isSidebarOpen && <h2 className="text-xl font-bold text-white tracking-wide">SIREVA</h2>}
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
          {filteredMenus.map((menu) => {
            const isActive = location.pathname === menu.path;
            const Icon = menu.icon;
            
            return (
              <Link 
                key={menu.name} 
                to={menu.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#FFF7ED]/10 text-orange-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-orange-400' : ''} />
                {isSidebarOpen && <span>{menu.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-semibold">Keluar</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Topbar - Putih bersih */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 z-10 justify-between shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-slate-500 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-orange-50"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.roles?.[0] || 'User'}</p>
            </div>
            {/* Avatar dengan warna Warm Orange */}
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-[#1E293B] font-extrabold shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT RENDERER (Outlet) */}
        <main className="flex-1 overflow-y-auto p-6 z-10 relative">
          {/* Background pattern tipis (opsional, memberikan tekstur premium) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <Outlet /> 
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

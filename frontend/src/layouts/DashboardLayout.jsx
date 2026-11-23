import { useContext, useState } from 'react';
import { AuthContext } from '../context/context';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Calendar, User, LayoutGrid, FileText, Users, LogOut, Menu 
} from 'lucide-react';
import bgImage from '../assets/bg-dashboard.avif';

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
    { name: 'Peminjaman', path: '/dashboard/peminjaman', icon: Calendar, roles: ['Admin', 'Petugas', 'Mahasiswa', 'Dosen'] },
    { name: 'Profil', path: '/dashboard/profil', icon: User, roles: ['Admin', 'Petugas', 'Mahasiswa', 'Dosen'] },
    { name: 'Kelola Ruangan', path: '/dashboard/fasilitas', icon: LayoutGrid, roles: ['Admin', 'Petugas'] },
    { name: 'Pengajuan', path: '/dashboard/pengajuan', icon: FileText, roles: ['Admin', 'Petugas'] },
    { name: 'Pengguna', path: '/dashboard/pengguna', icon: Users, roles: ['Admin'] },
  ];

  const userRoles = user?.roles || [];
  const filteredMenus = allMenus.filter(menu => 
    menu.roles.some(role => userRoles.includes(role))
  );

  return (
    <div className="flex h-screen bg-[#121212] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 250 }}
        animate={{ width: isSidebarOpen ? 250 : 80 }}
        className="bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full z-20 shadow-xl"
      >
        <div className="p-5 flex items-center gap-3 border-b border-gray-800">
          <img src="/logo-sireva.png" alt="SIREVA" className="h-8" onError={(e) => e.target.style.display = 'none'} />
          {isSidebarOpen && <h2 className="text-xl font-bold text-blue-400">SIREVA</h2>}
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
          {filteredMenus.map((menu) => {
            const isActive = location.pathname === menu.path;
            const Icon = menu.icon;
            
            return (
              <Link 
                key={menu.name} 
                to={menu.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-800 text-[#a3d977]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#a3d977]' : ''} />
                {isSidebarOpen && <span className="font-medium">{menu.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
           <img src={bgImage} className="w-full h-full object-cover" alt="bg" />
        </div>

        {/* TOPBAR */}
        <header className="h-16 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-gray-800 flex items-center px-6 z-10 justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-[#a3d977] flex items-center justify-center text-black font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT RENDERER (Outlet) */}
        <main className="flex-1 overflow-y-auto p-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet /> 
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
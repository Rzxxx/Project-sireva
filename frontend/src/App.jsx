import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/context';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import Peminjaman from './pages/Peminjaman';
import Pengajuan from './pages/Pengajuan';
import Pengguna from './pages/Pengguna';
import Profil from './pages/Profil';


const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) return <div className="text-white bg-black h-screen flex items-center justify-center">Loading...</div>; 
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          
          <Route path="peminjaman" element={<Peminjaman />} />
          <Route path="profil" element={<Profil />} />
          <Route path="fasilitas" element={<Facilities />} />
          <Route path="pengajuan" element={<Pengajuan />} />
          <Route path="pengguna" element={<Pengguna />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';
import api from '../lib/axios';
import { ShieldCheck } from 'lucide-react';

export default function Pengguna() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Gagal mengambil data user", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
        await fetchUsers();
    };
    loadData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah role');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Kelola Pengguna</h1>
        <p className="text-gray-400">Atur peran (role) dan hak akses pengguna SIREVA.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#121212] text-gray-400 text-sm border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Pengguna</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role Saat Ini</th>
              <th className="px-6 py-4 font-medium text-center">Ubah Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-8">Memuat data...</td></tr>
            ) : (
              users.map((u) => {
                const userRole = u.roles && u.roles.length > 0 ? u.roles[0].name : 'Tanpa Role';
                
                return (
                  <tr key={u.id} className="hover:bg-[#222] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2 font-medium text-white">
                      {u.name}
                      {u.id === currentUser.id && (
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">Anda</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 w-max bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                        <ShieldCheck size={14} className={userRole === 'Admin' ? 'text-red-400' : 'text-green-400'} />
                        {userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.id !== currentUser.id ? (
                        <select 
                          value={userRole}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#121212] text-white text-sm border border-gray-700 rounded-lg p-2 focus:border-green-500 outline-none cursor-pointer"
                        >
                          <option value="Mahasiswa">Mahasiswa</option>
                          <option value="Dosen">Dosen</option>
                          <option value="Petugas">Petugas</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : (
                        <span className="text-gray-500 text-sm italic">Tidak dapat diubah</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
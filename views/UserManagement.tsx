import React from 'react';
import { UserCircle, UserPlus, Shield, MoreVertical, Mail, CheckCircle2, XCircle } from 'lucide-react';

interface UserManagementProps {
  isDarkMode: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ isDarkMode }) => {
  const users = [
    { id: 1, name: 'Admin User', role: 'Super Admin', email: 'admin@skyhonda.com', status: 'Active' },
    { id: 2, name: 'Sales Manager', role: 'Manager', email: 'manager@skyhonda.com', status: 'Active' },
    { id: 3, name: 'Support Agent', role: 'Agent', email: 'support@skyhonda.com', status: 'Inactive' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>จัดการผู้ใช้งาน</h1>
          <p className="text-gray-400 text-sm">จัดการสิทธิ์และข้อมูลผู้ดูแลระบบทั้งหมด</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
          <UserPlus className="w-5 h-5" />
          เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className={`backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 group ${isDarkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-400 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                <UserCircle className="w-8 h-8" />
              </div>
              <button className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{user.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{user.email}</p>
            <div className={`flex items-center justify-between pt-4 border-t transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-blue-700'}`}>
                <Shield className="w-3 h-3" /> {user.role}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-500' : 'text-gray-500'}`}>
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;

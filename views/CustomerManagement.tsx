import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Mail, Phone, Car, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCustomers as initialCustomers } from '../data/mockData';

interface CustomerManagementProps {
  isDarkMode: boolean;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ isDarkMode }) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Thai Date Formatter
  const formatThaiDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.Phone.includes(searchTerm) ||
      c.CarModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.CustomerID.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลลูกค้ารายนี้?')) {
      setCustomers(prev => prev.filter(c => c.CustomerID !== id));
    }
  };

  const handleEdit = (id: string) => {
    alert(`แก้ไขข้อมูลลูกค้า: ${id} (ฟังก์ชันนี้กำลังพัฒนาเชื่อมต่อกับ GAS)`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>จัดการข้อมูลลูกค้า</h1>
          <p className="text-gray-400 text-sm">ค้นหาและจัดการข้อมูลลูกค้าทั้งหมดในระบบ ({filteredCustomers.length} รายการ)</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
          <UserPlus className="w-5 h-5" />
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`p-6 border-b flex flex-col md:flex-row md:items-center gap-4 transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, เบอร์โทรศัพท์, หรือรุ่นรถ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
          </div>
          <button className={`flex items-center gap-2 px-4 py-3 font-medium rounded-xl transition-all border ${isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-blue-600 hover:bg-blue-50'}`}>
            <Filter className="w-5 h-5" />
            ตัวกรอง
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <th className="px-6 py-4">รหัสลูกค้า</th>
                <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4">ข้อมูลติดต่อ</th>
                <th className="px-6 py-4">รุ่นรถ</th>
                <th className="px-6 py-4">วันที่รับรถ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.CustomerID} className={`transition-colors group ${isDarkMode ? 'hover:bg-gray-800/30' : 'hover:bg-blue-50/50'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-red-500">{customer.CustomerID}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{customer.Name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-500">
                        <Phone className="w-3 h-3" /> {customer.Phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-500">
                        <Mail className="w-3 h-3" /> {customer.Email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium w-fit ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-blue-700'}`}>
                      <Car className="w-3 h-3" /> {customer.CarModel}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{formatThaiDate(customer.DeliveryDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(customer.CustomerID)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.CustomerID)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`p-6 border-t flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'border-gray-800 bg-gray-900/30' : 'border-gray-100 bg-gray-50/30'}`}>
            <p className="text-sm text-gray-500">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} จาก {filteredCustomers.length} รายการ
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-200 hover:bg-white text-gray-600'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                      : isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-200 hover:bg-white text-gray-600'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;

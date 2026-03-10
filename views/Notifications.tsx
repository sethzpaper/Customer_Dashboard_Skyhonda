import React from 'react';
import { Bell, MessageSquare, AlertTriangle, CheckCircle2, MoreHorizontal, Trash2 } from 'lucide-react';

interface NotificationsProps {
  isDarkMode: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({ isDarkMode }) => {
  const notifications = [
    { id: 1, title: 'แบบสำรวจใหม่', desc: 'คุณสมชาย ใจดี เพิ่งส่งแบบประเมินความพึงพอใจ', time: '2 นาทีที่แล้ว', type: 'info', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 2, title: 'เคสเร่งด่วน', desc: 'คุณวิภาดา รักดี ต้องการให้ติดต่อกลับด่วนเรื่องแอร์ไม่เย็น', time: '15 นาทีที่แล้ว', type: 'warning', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 3, title: 'ระบบอัปเดตสำเร็จ', desc: 'ระบบได้รับการอัปเดตเป็นเวอร์ชันล่าสุดเรียบร้อยแล้ว', time: '1 ชั่วโมงที่แล้ว', type: 'success', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>การแจ้งเตือน</h1>
          <p className="text-gray-400 text-sm">ติดตามความเคลื่อนไหวและกิจกรรมทั้งหมดในระบบ</p>
        </div>
        <button className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-red-500 hover:text-red-400' : 'text-red-600 hover:text-red-700'}`}>
          ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 group flex items-start gap-6 ${isDarkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className={`p-4 rounded-xl ${notif.bg} ${notif.color} group-hover:scale-110 transition-transform duration-300`}>
              <notif.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{notif.title}</h3>
                <span className="text-xs text-gray-500 font-medium">{notif.time}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{notif.desc}</p>
            </div>
            <button className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

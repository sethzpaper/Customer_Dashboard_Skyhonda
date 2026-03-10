import React from 'react';
import { HelpCircle, Book, MessageSquare, Phone, ExternalLink, Search } from 'lucide-react';

interface HelpCenterProps {
  isDarkMode: boolean;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isDarkMode }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ศูนย์ช่วยเหลือ</h1>
          <p className="text-gray-400 text-sm">คู่มือการใช้งานและช่องทางการติดต่อฝ่ายสนับสนุน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'คู่มือการใช้งาน', desc: 'อ่านคู่มือการใช้งานระบบอย่างละเอียด', icon: Book, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'คำถามที่พบบ่อย', desc: 'รวมคำถามที่พบบ่อยเกี่ยวกับการใช้งาน', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'ติดต่อฝ่ายไอที', desc: 'แจ้งปัญหาการใช้งานหรือขอความช่วยเหลือ', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((item, i) => (
          <div key={i} className={`backdrop-blur-sm border p-8 rounded-3xl transition-all duration-300 group cursor-pointer ${isDarkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{item.desc}</p>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-white group-hover:text-red-500' : 'text-blue-600 group-hover:text-red-600'}`}>
              อ่านเพิ่มเติม <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>

      <div className={`border p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' : 'bg-blue-50 border-blue-100'}`}>
        <div className="space-y-2 text-center md:text-left">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ต้องการความช่วยเหลือเร่งด่วน?</h3>
          <p className="text-gray-400">ฝ่ายสนับสนุนของเราพร้อมให้บริการคุณทุกวัน ตั้งแต่เวลา 08:30 - 17:30 น.</p>
        </div>
        <button className={`flex items-center gap-3 px-8 py-4 font-bold rounded-2xl transition-all duration-300 shadow-xl ${isDarkMode ? 'bg-white text-black hover:bg-red-600 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          <Phone className="w-5 h-5" />
          โทร 02-XXX-XXXX
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;

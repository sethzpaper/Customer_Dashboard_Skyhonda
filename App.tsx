import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Users, Upload, BarChart3, Settings, HelpCircle, Bell, UserCircle, Sun, Moon } from 'lucide-react';
import Dashboard from './views/Dashboard';
import SurveyForm from './views/SurveyForm';
import CustomerManagement from './views/CustomerManagement';
import ImportData from './views/ImportData';
import AnalyticsReports from './views/AnalyticsReports';
import UserManagement from './views/UserManagement';
import SettingsView from './views/Settings';
import HelpCenter from './views/HelpCenter';
import Notifications from './views/Notifications';

export type View = 'dashboard' | 'survey' | 'customers' | 'importData' | 'reports' | 'users' | 'settings' | 'help' | 'notifications';

export interface FeaturedModel {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
}

const initialFeaturedModels: FeaturedModel[] = [
  {
    id: 1,
    title: 'All-New Honda Civic',
    description: 'สัมผัสประสบการณ์การขับขี่ที่เหนือระดับ พร้อมเทคโนโลยีความปลอดภัยอัจฉริยะ Honda SENSING',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
    price: 'เริ่มต้น 964,900 บาท'
  },
  {
    id: 2,
    title: 'Honda CR-V e:HEV',
    description: 'ยนตรกรรมพรีเมียมเอสยูวีที่สมบูรณ์แบบ ขับเคลื่อนด้วยระบบฟูลไฮบริด e:HEV อันทรงพลัง',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    price: 'เริ่มต้น 1,419,000 บาท'
  },
  {
    id: 3,
    title: 'Honda City Hatchback',
    description: 'ซิตี้คาร์ 5 ประตูที่ตอบโจทย์ทุกไลฟ์สไตล์ ด้วยพื้นที่ใช้สอยที่ปรับเปลี่ยนได้หลากหลาย',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200',
    price: 'เริ่มต้น 599,000 บาท'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [featuredModels, setFeaturedModels] = useState<FeaturedModel[]>(initialFeaturedModels);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard featuredModels={featuredModels} isDarkMode={isDarkMode} />;
      case 'survey': return <SurveyForm isDarkMode={isDarkMode} />;
      case 'customers': return <CustomerManagement isDarkMode={isDarkMode} />;
      case 'importData': return <ImportData isDarkMode={isDarkMode} />;
      case 'reports': return <AnalyticsReports isDarkMode={isDarkMode} />;
      case 'users': return <UserManagement isDarkMode={isDarkMode} />;
      case 'settings': return (
        <SettingsView 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          featuredModels={featuredModels} 
          setFeaturedModels={setFeaturedModels} 
        />
      );
      case 'help': return <HelpCenter isDarkMode={isDarkMode} />;
      case 'notifications': return <Notifications isDarkMode={isDarkMode} />;
      default: return <Dashboard featuredModels={featuredModels} isDarkMode={isDarkMode} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'survey', label: 'แบบสำรวจ', icon: ClipboardList },
    { id: 'customers', label: 'ลูกค้า', icon: Users },
    { id: 'importData', label: 'นำเข้าข้อมูล', icon: Upload },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'users', label: 'ผู้ใช้งาน', icon: UserCircle, adminOnly: true },
  ];

  const bottomNavItems = [
    { id: 'help', label: 'ช่วยเหลือ', icon: HelpCircle },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings, adminOnly: true },
  ];

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-800'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-colors duration-300 print:hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-blue-900 border-blue-800'}`}>
        <div className={`flex items-center p-6 border-b gap-3 transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-blue-800'}`}>
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Sky Honda</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? (isDarkMode ? 'bg-red-600/10 text-red-500' : 'bg-white/10 text-white shadow-sm') 
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-blue-100 hover:bg-white/5 hover:text-white')
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`px-4 py-6 border-t space-y-1 transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-blue-800'}`}>
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? (isDarkMode ? 'bg-red-600/10 text-red-500' : 'bg-white/10 text-white') 
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-blue-100 hover:bg-white/5 hover:text-white')
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className={`h-16 backdrop-blur-md border-b px-8 flex justify-between items-center z-10 transition-colors duration-300 print:hidden ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <h2 className={`text-lg font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
            {navItems.find(i => i.id === currentView)?.label || bottomNavItems.find(i => i.id === currentView)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setCurrentView('notifications')}
              className={`p-2 transition-colors relative rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <div className={`h-8 w-px mx-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
                <p className="text-[10px] text-gray-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </header>
        
        {/* View Content */}
        <main className="flex-1 overflow-y-auto relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;

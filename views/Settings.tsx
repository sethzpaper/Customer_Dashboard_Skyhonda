import React, { useState } from 'react';
import { Shield, Save, Moon, Sun, Image as ImageIcon } from 'lucide-react';
import { FeaturedModel } from '../App';

interface SettingsProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  featuredModels: FeaturedModel[];
  setFeaturedModels: React.Dispatch<React.SetStateAction<FeaturedModel[]>>;
}

const SettingsView: React.FC<SettingsProps> = ({ isDarkMode, setIsDarkMode, featuredModels, setFeaturedModels }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ตั้งค่าระบบ</h1>
          <p className="text-gray-400 text-sm">จัดการการตั้งค่าทั่วไป ความปลอดภัย และเนื้อหาหน้าแรก</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
          <Save className="w-5 h-5" />
          บันทึกการตั้งค่า
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Theme Settings */}
          <div className={`backdrop-blur-sm border p-8 rounded-3xl space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 font-semibold mb-6">
              <Sun className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <h3 className={isDarkMode ? 'text-white' : 'text-blue-900'}>ธีมและการแสดงผล</h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>โหมดกลางคืน (Dark Mode)</p>
                  <p className="text-xs text-gray-500">เปลี่ยนการแสดงผลเป็นโทนสีมืด</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Featured Models Management */}
          <div className={`backdrop-blur-sm border p-8 rounded-3xl space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 font-semibold mb-6">
              <ImageIcon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={isDarkMode ? 'text-white' : 'text-blue-900'}>จัดการ Featured Models (หน้าแรก)</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">รายการรถยนต์ที่แสดงในหน้าแรก (สามารถจัดการข้อมูลทั้งหมดได้ที่เมนู "จัดการรถยนต์")</p>
              {featuredModels.map(model => (
                <div key={model.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <img src={model.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{model.title}</p>
                    <p className="text-xs text-gray-500 truncate">{model.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`backdrop-blur-sm border p-8 rounded-3xl space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 font-semibold mb-6">
              <Shield className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <h3 className={isDarkMode ? 'text-white' : 'text-blue-900'}>ความปลอดภัย</h3>
            </div>
            <div className="space-y-4">
              <button className={`w-full px-4 py-3 font-medium rounded-xl transition-all border text-left ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white' : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-blue-600'}`}>
                เปลี่ยนรหัสผ่าน
              </button>
              <button className={`w-full px-4 py-3 font-medium rounded-xl transition-all border text-left ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white' : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-blue-600'}`}>
                ตั้งค่าการยืนยันตัวตน 2 ชั้น
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

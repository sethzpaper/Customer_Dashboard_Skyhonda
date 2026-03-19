import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, Users, ClipboardCheck, AlertCircle } from 'lucide-react';
import { FeaturedModel } from '../App';
import { DashboardSummary, SurveyResponse } from '../types';

interface DashboardProps {
  featuredModels: FeaturedModel[];
  isDarkMode: boolean;
  summary: DashboardSummary | null;
  recentSurveys: SurveyResponse[];
  totalCustomers: number;
}

const Dashboard: React.FC<DashboardProps> = ({ featuredModels, isDarkMode, summary, recentSurveys, totalCustomers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredModels.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredModels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredModels.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredModels.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredModels.length) % featuredModels.length);

  // Calculate real stats from props or use defaults
  const totalSurveys = recentSurveys.length;
  const avgSatisfaction = summary?.satisfactionScore || 0;
  const nps = summary?.nps || 0;
  const pendingCases = summary?.followUps || 0;

  const kpis = [
    { label: 'ความพึงพอใจรวม', value: avgSatisfaction.toString(), sub: 'จากแบบสำรวจล่าสุด', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'จำนวนลูกค้าทั้งหมด', value: totalCustomers.toString(), sub: 'ในระบบทั้งหมด', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'NPS Score', value: nps.toString(), sub: 'ดัชนีความภักดี', icon: ClipboardCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'เคสที่ต้องติดตาม', value: pendingCases.toString(), sub: 'สถานะเปิดอยู่', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="relative min-h-full p-8">
      {/* Faded Background Car Image */}
      <div 
        className={`absolute inset-0 z-0 opacity-10 pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ยินดีต้อนรับ, Sky Honda Admin</h1>
            <p className="text-gray-500 mt-1">สรุปภาพรวมความพึงพอใจของลูกค้าและข้อมูลการขายวันนี้</p>
          </div>
          <div className={`flex items-center gap-2 p-1 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50 border-gray-200'}`}>
            <button className="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-lg shadow-lg shadow-red-900/20">วันนี้</button>
            <button className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors">สัปดาห์นี้</button>
            <button className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors">เดือนนี้</button>
          </div>
        </div>

        {/* Car Showcase Slider */}
        {featuredModels.length > 0 && (
          <div className={`relative h-[400px] w-full rounded-3xl overflow-hidden group shadow-2xl border transition-colors duration-300 ${isDarkMode ? 'border-gray-800 shadow-black/50' : 'border-gray-200 shadow-blue-900/10'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={featuredModels[currentSlide].image} 
                  alt={featuredModels[currentSlide].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent`} />
                
                <div className="absolute bottom-0 left-0 p-10 max-w-2xl">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      Featured Model
                    </span>
                    <h2 className="text-4xl font-bold text-white mb-2">{featuredModels[currentSlide].title}</h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {featuredModels[currentSlide].description}
                    </p>
                    <div className="flex items-center gap-6">
                      <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg">
                        จองเลย
                      </button>
                      <span className="text-white font-semibold text-xl">{featuredModels[currentSlide].price}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-red-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-red-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 right-10 flex gap-2">
              {featuredModels.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-red-600' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className={`backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 group ${isDarkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Realtime</span>
              </div>
              <h3 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{kpi.value}</span>
                <span className={`text-xs font-medium ${kpi.color}`}>{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

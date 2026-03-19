import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter, PieChart as PieChartIcon, Printer, X, Check, FileText } from 'lucide-react';
import { SurveyResponse, Salesperson, Customer } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

interface AnalyticsReportsProps {
  isDarkMode: boolean;
  surveys: SurveyResponse[];
  salespersons: Salesperson[];
  customers: Customer[];
}

const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({ isDarkMode, surveys, salespersons, customers }) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState<'weekly' | 'monthly'>('monthly');

  const avgSatisfaction = surveys.length > 0 
    ? (surveys.reduce((acc, s) => acc + s.Sales_InfoClarity, 0) / surveys.length).toFixed(1)
    : '0.0';
  const followUpRate = surveys.length > 0
    ? ((surveys.filter(s => s.FollowUp_Requested === 'ใช่').length / surveys.length) * 100).toFixed(0)
    : '0';

  // Data for Satisfaction Distribution
  const scoreDist = [1, 2, 3, 4, 5].map(score => ({
    score: `${score} ดาว`,
    count: surveys.filter(s => s.Sales_InfoClarity === score).length
  }));

  // Data for Survey Type Distribution
  const typeDist = [
    { name: 'Delivery', value: surveys.filter(s => s.SurveyType === 'Delivery').length },
    { name: '7-Day', value: surveys.filter(s => s.SurveyType === '7-Day').length },
    { name: '30-Day', value: surveys.filter(s => s.SurveyType === '30-Day').length },
  ];

  // Data for Salesperson Performance
  const salesPerformance = salespersons.map(sp => {
    const spSurveys = surveys.filter(s => s.SalespersonID === sp.SalespersonID);
    const avg = spSurveys.length > 0 
      ? (spSurveys.reduce((acc, s) => acc + s.Sales_InfoClarity, 0) / spSurveys.length).toFixed(1)
      : 0;
    return {
      name: sp.Name.split(' ')[0], // Use first name
      avg: parseFloat(avg as string)
    };
  });

  // Data for Satisfaction Trend (Grouped by Date)
  const trendData = surveys
    .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
    .reduce((acc: any[], curr) => {
      const date = curr.Timestamp.split('T')[0];
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.total += curr.Sales_InfoClarity;
        existing.count += 1;
        existing.avg = parseFloat((existing.total / existing.count).toFixed(1));
      } else {
        acc.push({ date, total: curr.Sales_InfoClarity, count: 1, avg: curr.Sales_InfoClarity });
      }
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const chartBg = isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm';
  const textColor = isDarkMode ? '#9ca3af' : '#4b5563';
  const gridColor = isDarkMode ? '#1f2937' : '#f3f4f6';

  // Print Summary Logic
  const getPrintData = () => {
    const grouped: Record<string, any> = {};
    
    surveys.forEach(survey => {
      const date = new Date(survey.Timestamp);
      let key = '';
      
      if (printType === 'monthly') {
        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      } else {
        // Weekly logic (simplified: use week number)
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `สัปดาห์ที่ ${weekNum} (${date.getFullYear()})`;
      }

      if (!grouped[key]) {
        grouped[key] = { period: key, total: 0, sumSatisfaction: 0, followUps: 0 };
      }
      
      grouped[key].total += 1;
      grouped[key].sumSatisfaction += survey.Sales_InfoClarity;
      if (survey.FollowUp_Requested === 'ใช่') {
        grouped[key].followUps += 1;
      }
    });

    return Object.values(grouped).map((item: any) => ({
      ...item,
      avg: (item.sumSatisfaction / item.total).toFixed(1)
    }));
  };

  const handlePrint = () => {
    window.print();
    setShowPrintModal(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>รายงานและการวิเคราะห์</h1>
          <p className="text-gray-400 text-sm">วิเคราะห์ข้อมูลความพึงพอใจและประสิทธิภาพการบริการ</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white' : 'bg-white text-gray-600 border-gray-200 hover:text-blue-600'}`}>
            <Download className="w-4 h-4" />
            ส่งออกข้อมูล
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white' : 'bg-white text-gray-600 border-gray-200 hover:text-blue-600'}`}>
            <Calendar className="w-4 h-4" />
            เลือกช่วงเวลา
          </button>
          <button 
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            <Printer className="w-4 h-4" />
            ปรินท์เอกสาร
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${chartBg}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-medium">ความพึงพอใจเฉลี่ย</p>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{avgSatisfaction}</span>
            <span className="text-emerald-500 text-sm font-bold mb-1">+0.2 จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${chartBg}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-medium">อัตราการขอติดต่อกลับ</p>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{followUpRate}%</span>
            <span className="text-red-500 text-sm font-bold mb-1">+5% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${chartBg}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-medium">จำนวนแบบประเมิน</p>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{surveys.length}</span>
            <span className="text-emerald-500 text-sm font-bold mb-1">รายการทั้งหมด</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        {/* Satisfaction Distribution */}
        <div className={`p-8 rounded-3xl border transition-colors duration-300 ${chartBg}`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>การกระจายคะแนนความพึงพอใจ</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDist}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="score" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#111827' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Survey Type Distribution */}
        <div className={`p-8 rounded-3xl border transition-colors duration-300 ${chartBg}`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>สัดส่วนประเภทแบบประเมิน</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#111827' : '#fff', border: 'none', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction Trend */}
        <div className={`p-8 rounded-3xl border transition-colors duration-300 ${chartBg} lg:col-span-2`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>แนวโน้มความพึงพอใจรายวัน</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#111827' : '#fff', border: 'none', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salesperson Performance */}
        <div className={`p-8 rounded-3xl border transition-colors duration-300 ${chartBg} lg:col-span-2`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ประสิทธิภาพพนักงานขาย (คะแนนเฉลี่ย)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" domain={[0, 5]} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#111827' : '#fff', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="avg" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="p-6 border-b flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ปรินท์สรุปรายงาน</h3>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-sm text-gray-500">เลือกรูปแบบการสรุปข้อมูลที่ต้องการปรินท์ออกมาเป็นตาราง</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPrintType('weekly')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    printType === 'weekly' 
                      ? 'border-blue-600 bg-blue-600/5 text-blue-600' 
                      : isDarkMode ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-500 hover:border-blue-200'
                  }`}
                >
                  <Calendar className="w-8 h-8" />
                  <span className="font-bold">รายอาทิตย์</span>
                </button>
                <button 
                  onClick={() => setPrintType('monthly')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    printType === 'monthly' 
                      ? 'border-blue-600 bg-blue-600/5 text-blue-600' 
                      : isDarkMode ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-500 hover:border-blue-200'
                  }`}
                >
                  <FileText className="w-8 h-8" />
                  <span className="font-bold">รายเดือน</span>
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className={`flex-1 py-3 font-bold rounded-xl transition-all ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                  ยืนยันและปรินท์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Table (Hidden by default, visible only during print) */}
      <div className="hidden print:block p-8 bg-white text-black">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">รายงานสรุปความพึงพอใจลูกค้า (Sky Honda)</h1>
          <p className="text-gray-600">ประเภทรายงาน: {printType === 'weekly' ? 'รายอาทิตย์' : 'รายเดือน'}</p>
          <p className="text-sm text-gray-400 mt-1">พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</p>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left">ช่วงเวลา</th>
              <th className="border border-gray-300 px-4 py-3 text-center">จำนวนแบบประเมิน</th>
              <th className="border border-gray-300 px-4 py-3 text-center">คะแนนเฉลี่ย</th>
              <th className="border border-gray-300 px-4 py-3 text-center">ขอติดต่อกลับ</th>
            </tr>
          </thead>
          <tbody>
            {getPrintData().map((item: any, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-3 font-medium">{item.period}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.total} รายการ</td>
                <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-600">{item.avg} / 5.0</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.followUps} รายการ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="border-t border-gray-300 pt-4 text-center">
            <p className="text-sm text-gray-500">ลงชื่อผู้ตรวจสอบ</p>
            <div className="h-16"></div>
            <p className="font-bold">(....................................................)</p>
          </div>
          <div className="border-t border-gray-300 pt-4 text-center">
            <p className="text-sm text-gray-500">ลงชื่อผู้อนุมัติ</p>
            <div className="h-16"></div>
            <p className="font-bold">(....................................................)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;

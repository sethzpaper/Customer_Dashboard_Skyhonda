import React, { useState } from 'react';
import { Send, Upload, Star, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SurveyResponse, SurveyType } from '../types';

interface SurveyFormProps {
  isDarkMode: boolean;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<SurveyResponse>>({
    SurveyType: 'Delivery',
    Sales_InfoClarity: 5,
    FollowUp_Requested: 'ไม่ใช่',
    Status: 'เปิดอยู่'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className={`backdrop-blur-md border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">แบบประเมินความพึงพอใจลูกค้า</h2>
          <p className="text-blue-100 opacity-80">ความคิดเห็นของท่านมีความสำคัญต่อการพัฒนาการบริการของเรา</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">ประเภทแบบประเมิน</label>
              <select 
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                value={formData.SurveyType}
                onChange={(e) => setFormData({...formData, SurveyType: e.target.value as SurveyType})}
              >
                <option value="Delivery">Delivery (วันรับรถ)</option>
                <option value="7-Day">7-Day Follow-up</option>
                <option value="30-Day">30-Day Follow-up</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">รหัสลูกค้า (CustomerID)</label>
              <input 
                type="text" 
                placeholder="CUST-XXXXX"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                onChange={(e) => setFormData({...formData, CustomerID: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">รหัสพนักงานขาย (SalespersonID)</label>
              <input 
                type="text" 
                placeholder="SALE-XXXXX"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                onChange={(e) => setFormData({...formData, SalespersonID: e.target.value})}
              />
            </div>
          </div>

          <div className={`h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />

          {/* Section 2: Sales Evaluation */}
          <div className="space-y-6">
            <div className={`flex items-center gap-3 font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              <Star className="w-5 h-5 text-yellow-500" />
              <h3>การบริการของพนักงานขาย</h3>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400">พนักงานอธิบายข้อมูลรถยนต์ได้ชัดเจนเพียงใด? (1-5)</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({...formData, Sales_InfoClarity: num})}
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 ${
                      formData.Sales_InfoClarity === num 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110' 
                        : (isDarkMode ? 'bg-gray-800 text-gray-500 hover:bg-gray-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200')
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">สิ่งที่พนักงานขายทำได้ดี</label>
              <textarea 
                rows={3}
                placeholder="ระบุความประทับใจ..."
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                onChange={(e) => setFormData({...formData, Sales_GoodFeedback: e.target.value})}
              />
            </div>
          </div>

          <div className={`h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />

          {/* Section 3: Complaints */}
          <div className="space-y-6">
            <div className={`flex items-center gap-3 font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3>ข้อร้องเรียนหรือปัญหาที่พบ</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">รายละเอียดปัญหา (ถ้ามี)</label>
              <textarea 
                rows={3}
                placeholder="ระบุรายละเอียดปัญหาที่พบ..."
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                onChange={(e) => setFormData({...formData, Complaint_Details: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">แนบรูปภาพ/วิดีโอ (URL)</label>
              <div className="relative">
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/..."
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  onChange={(e) => setFormData({...formData, Complaint_AttachmentURL: e.target.value})}
                />
                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className={`h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />

          {/* Section 4: Follow up */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <div className="space-y-1">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>ต้องการให้เจ้าหน้าที่ติดต่อกลับหรือไม่?</h4>
              <p className="text-xs text-gray-500">เราจะดำเนินการติดต่อกลับภายใน 24 ชั่วโมง</p>
            </div>
            <div className="flex gap-2">
              {['ใช่', 'ไม่ใช่'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({...formData, FollowUp_Requested: option as 'ใช่' | 'ไม่ใช่'})}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    formData.FollowUp_Requested === option 
                      ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-blue-600 text-white shadow-lg') 
                      : (isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300')
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              isSuccess 
                ? 'bg-emerald-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-900/20'
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                ส่งข้อมูลสำเร็จ
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                ส่งแบบประเมิน
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;

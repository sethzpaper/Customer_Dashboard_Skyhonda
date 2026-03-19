import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Clipboard, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { Customer } from '../types';
import { googleSheetService } from '../services/googleSheetService';

interface ImportDataProps {
  isDarkMode: boolean;
}

type ImportTab = 'paste' | 'link' | 'csv';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const ImportData: React.FC<ImportDataProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<ImportTab>('paste');
  const [pasteData, setPasteData] = useState('');
  const [sheetLink, setSheetLink] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const parsePasteData = (text: string): Customer[] => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];

    // Skip header if it looks like one
    const startIdx = lines[0].toLowerCase().includes('customerid') || lines[0].toLowerCase().includes('รหัส') ? 1 : 0;
    
    const customers: Customer[] = [];
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split('\t'); // Excel/Sheets usually paste with tabs
      if (cols.length >= 6) {
        customers.push({
          CustomerID: cols[0].trim(),
          Name: cols[1].trim(),
          Phone: cols[2].trim(),
          Email: cols[3].trim(),
          CarModel: cols[4].trim(),
          DeliveryDate: cols[5].trim(),
        });
      } else if (cols.length === 1 && lines[i].includes(',')) {
        // Try CSV if tab didn't work
        const csvCols = lines[i].split(',');
        if (csvCols.length >= 6) {
          customers.push({
            CustomerID: csvCols[0].trim(),
            Name: csvCols[1].trim(),
            Phone: csvCols[2].trim(),
            Email: csvCols[3].trim(),
            CarModel: csvCols[4].trim(),
            DeliveryDate: csvCols[5].trim(),
          });
        }
      }
    }
    return customers;
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportResult(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let dataToImport: Customer[] = [];
    let errors: string[] = [];

    if (activeTab === 'paste') {
      dataToImport = parsePasteData(pasteData);
      if (dataToImport.length === 0) {
        errors.push('ไม่พบข้อมูลที่ถูกต้องสำหรับการนำเข้า');
      }
    } else if (activeTab === 'link') {
      if (!sheetLink.includes('docs.google.com/spreadsheets')) {
        errors.push('ลิงก์ Google Sheets ไม่ถูกต้อง');
      } else {
        // Mock success for link
        dataToImport = [
          { CustomerID: 'CUST-NEW-1', Name: 'นำเข้าจากลิงก์ 1', Phone: '081-000-0001', Email: 'link1@test.com', CarModel: 'Honda Civic', DeliveryDate: '2024-03-10' },
          { CustomerID: 'CUST-NEW-2', Name: 'นำเข้าจากลิงก์ 2', Phone: '081-000-0002', Email: 'link2@test.com', CarModel: 'Honda City', DeliveryDate: '2024-03-11' },
        ];
      }
    } else if (activeTab === 'csv') {
      // Mock success for CSV
      dataToImport = [
        { CustomerID: 'CSV-001', Name: 'ลูกค้าจาก CSV 1', Phone: '082-000-0001', Email: 'csv1@test.com', CarModel: 'Honda Accord', DeliveryDate: '2024-03-12' },
      ];
    }

    // Simple validation simulation
    const validData = dataToImport.filter(c => c.CustomerID && c.Name);
    const successCount = validData.length;
    const failedCount = dataToImport.length - successCount + (errors.length > 0 ? 1 : 0);

    if (successCount > 0) {
      const success = await googleSheetService.saveCustomers(validData);
      if (!success) {
        errors.push('เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Google Sheets');
      }
    }

    setImportResult({
      success: successCount,
      failed: failedCount,
      errors: errors
    });
    setIsImporting(false);
  };

  const tabs = [
    { id: 'paste', label: 'ก็อปวางข้อมูล', icon: Clipboard },
    { id: 'link', label: 'วางลิงก์ Google Sheets', icon: LinkIcon },
    { id: 'csv', label: 'อัปโหลด CSV', icon: FileText },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>นำเข้าข้อมูลลูกค้า</h1>
          <p className="text-gray-400 text-sm">เลือกวิธีการนำเข้าข้อมูลลูกค้าเข้าสู่ระบบ</p>
        </div>
      </div>

      <div className={`backdrop-blur-sm border rounded-3xl overflow-hidden shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Tabs Header */}
        <div className={`flex border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ImportTab);
                setImportResult(null);
              }}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${
                activeTab === tab.id 
                  ? 'text-red-600' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-6">
          {/* Tab Content */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  วางข้อมูลจาก Excel หรือ Google Sheets (คั่นด้วย Tab หรือ Comma)
                </label>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">CustomerID, Name, Phone, Email, CarModel, DeliveryDate</span>
              </div>
              <textarea
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="CUST-001	คุณสมชาย ใจดี	081-234-5678	somchai@email.com	Honda Civic	2024-01-15"
                className={`w-full h-64 p-6 rounded-2xl border outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono text-sm ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-4">
              <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ลิงก์ Google Sheets (ต้องเปิดสิทธิ์ให้ทุกคนที่มีลิงก์อ่านได้)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              <div className={`p-4 rounded-xl border flex gap-3 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  ระบบจะดึงข้อมูลจาก Sheet แรก โดยเรียงลำดับคอลัมน์ตามที่กำหนด: CustomerID, Name, Phone, Email, CarModel, DeliveryDate
                </p>
              </div>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-6">
              <div className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-colors ${
                isDarkMode ? 'border-gray-800 hover:border-gray-700 bg-gray-900/30' : 'border-gray-200 hover:border-blue-300 bg-gray-50'
              }`}>
                <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                  <p className="text-sm text-gray-500 mt-1">รองรับเฉพาะไฟล์ .csv เท่านั้น (สูงสุด 5MB)</p>
                </div>
                <button className={`mt-2 px-6 py-2 rounded-xl font-bold text-sm border transition-all ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}>
                  เลือกไฟล์
                </button>
              </div>
              
              <div className="flex justify-center">
                <button className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  ดาวน์โหลดไฟล์ตัวอย่าง (CSV Template)
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleImport}
              disabled={isImporting || (activeTab === 'paste' && !pasteData) || (activeTab === 'link' && !sheetLink)}
              className={`flex items-center gap-3 px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังนำเข้าข้อมูล...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  เริ่มนำเข้าข้อมูล
                </>
              )}
            </button>
          </div>

          {/* Result Summary */}
          {importResult && (
            <div className={`mt-8 p-8 rounded-3xl border animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'
            }`}>
              <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>สรุปผลการนำเข้า</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{importResult.success}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">นำเข้าสำเร็จ</p>
                  </div>
                </div>
                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                  <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{importResult.failed}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">นำเข้าไม่สำเร็จ</p>
                  </div>
                </div>
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-bold text-red-500">ข้อผิดพลาดที่พบ:</p>
                  <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Column Info Card */}
      <div className={`p-8 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>โครงสร้างคอลัมน์ที่ต้องการ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { col: 'CustomerID', desc: 'รหัสลูกค้า (Primary Key)', ex: 'CUST-001' },
            { col: 'Name', desc: 'ชื่อ-นามสกุล ลูกค้า', ex: 'คุณสมชาย ใจดี' },
            { col: 'Phone', desc: 'เบอร์โทรศัพท์', ex: '081-234-5678' },
            { col: 'Email', desc: 'อีเมล', ex: 'somchai@email.com' },
            { col: 'CarModel', desc: 'รุ่นรถที่ซื้อ', ex: 'Honda Civic' },
            { col: 'DeliveryDate', desc: 'วันที่รับรถ', ex: '2024-01-15' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-red-500 font-bold text-sm">{item.col}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              <p className={`text-[10px] mt-2 font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ตัวอย่าง: {item.ex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportData;

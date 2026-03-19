import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Car, DollarSign, Settings, Info, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { FeaturedModel } from '../App';
import { googleSheetService } from '../services/googleSheetService';

interface CarManagementProps {
  isDarkMode: boolean;
  featuredModels: FeaturedModel[];
  setFeaturedModels: React.Dispatch<React.SetStateAction<FeaturedModel[]>>;
}

const CarManagement: React.FC<CarManagementProps> = ({ isDarkMode, featuredModels, setFeaturedModels }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<FeaturedModel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<FeaturedModel>>({
    title: '',
    carType: '',
    chassisCode: '',
    modelYear: '',
    engine: '',
    transmission: '',
    price: '',
    image: '',
    description: ''
  });

  const filteredModels = featuredModels.filter(model =>
    model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.chassisCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (model?: FeaturedModel) => {
    if (model) {
      setEditingModel(model);
      setFormData(model);
    } else {
      setEditingModel(null);
      setFormData({
        title: '',
        carType: '',
        chassisCode: '',
        modelYear: '',
        engine: '',
        transmission: '',
        price: '',
        image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modelToSave = {
        ...formData,
        id: editingModel ? editingModel.id : Date.now(),
      } as FeaturedModel;

      await googleSheetService.saveCarModel(modelToSave);

      if (editingModel) {
        setFeaturedModels(prev => prev.map(m => m.id === editingModel.id ? modelToSave : m));
      } else {
        setFeaturedModels(prev => [...prev, modelToSave]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving car model:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      try {
        await googleSheetService.deleteCarModel(id);
        setFeaturedModels(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting car model:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>จัดการข้อมูลรถยนต์</h1>
          <p className="text-gray-500 text-sm">เพิ่ม แก้ไข และจัดการข้อมูลรุ่นรถยนต์ในระบบ</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          เพิ่มข้อมูลใหม่
        </button>
      </div>

      {/* Search Bar */}
      <div className={`relative max-w-md transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-sm border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาชื่อรุ่น หรือรหัสตัวถัง..."
          className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Car List Table */}
      <div className={`overflow-hidden rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'bg-gray-50 border-gray-100'}`}>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">รุ่นรถ</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภท/รหัสตัวถัง</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">เครื่องยนต์/เกียร์</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ราคาเริ่มต้น</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredModels.map((model) => (
                <tr key={model.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-gray-800/30' : 'hover:bg-blue-50/30'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                        <img src={model.image} alt={model.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{model.title}</p>
                        <p className="text-xs text-gray-500">ปี {model.modelYear || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{model.carType || '-'}</p>
                    <p className="text-xs text-gray-500">{model.chassisCode || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{model.engine || '-'}</p>
                    <p className="text-xs text-gray-500">{model.transmission || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-blue-500">{model.price}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(model)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-blue-100 text-gray-500 hover:text-blue-600'}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(model.id)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-500' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
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
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  {editingModel ? 'แก้ไขข้อมูลรถยนต์' : 'เพิ่มข้อมูลรถยนต์ใหม่'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อรุ่นรถ</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภทรถ (เช่น Sedan, SUV)</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.carType}
                    onChange={e => setFormData({ ...formData, carType: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">รหัสตัวถัง</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.chassisCode}
                    onChange={e => setFormData({ ...formData, chassisCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">รุ่นปี (Model Year)</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.modelYear}
                    onChange={e => setFormData({ ...formData, modelYear: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">เครื่องยนต์</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.engine}
                    onChange={e => setFormData({ ...formData, engine: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ระบบส่งกำลัง</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.transmission}
                    onChange={e => setFormData({ ...formData, transmission: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ราคาเริ่มต้น</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="เช่น เริ่มต้น 964,900 บาท"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL รูปภาพ</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">คำบรรยาย</label>
                  <textarea
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2 ${
                      isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      'บันทึกข้อมูล'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;

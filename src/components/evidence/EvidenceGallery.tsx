import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Eye,
  Filter,
  Calendar,
  ShieldCheck,
  Sparkles,
  Upload,
  CheckCircle,
  X,
} from 'lucide-react';
import { EvidenceItem } from '../../types';
import { storageService } from '../../services/storageService';

export const EvidenceGallery: React.FC = () => {
  const [evidences, setEvidences] = useState<EvidenceItem[]>(() =>
    storageService.getEvidences()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [lightboxItem, setLightboxItem] = useState<EvidenceItem | null>(null);

  // New Evidence Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EvidenceItem['category']>('Giáo viên hướng dẫn');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const categories = [
    'Tất cả',
    'Giáo viên hướng dẫn',
    'Học sinh thảo luận nhóm',
    'Làm nhiệm vụ trên thiết bị',
    'Trình bày sản phẩm',
    'Sơ đồ kiến thức',
    'Nhật ký tiến bộ',
  ];

  const filtered = evidences.filter(
    (e) => selectedCategory === 'Tất cả' || e.category === selectedCategory
  );

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fallbackImages = [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    ];

    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      description: newDesc.trim() || 'Minh chứng hoạt động thực tế lớp 5B.',
      imageUrl: newImageUrl.trim() || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      isPublic: true,
    };

    storageService.addEvidence(item);
    setEvidences(storageService.getEvidences());
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewImageUrl('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Cô có chắc muốn xóa minh chứng này?')) {
      storageService.deleteEvidence(id);
      setEvidences(storageService.getEvidences());
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <Camera className="w-4 h-4 text-pink-500" />
            <span>Hồ Sơ Thực Nghiệm Sư Phạm • Lớp 5B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
            Thư Viện Minh Chứng Triển Khai
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Nơi lưu giữ các hình ảnh, tư liệu hoạt động học tập, sản phẩm sơ đồ tư duy và nhật ký tiến bộ thực tế của học sinh Lớp 5B Trường TH Khoái Châu 1.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1689F8] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Minh Chứng Mới</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Nguyên tắc đạo đức & an toàn hình ảnh:</strong> Ảnh minh chứng tuân thủ nghiêm ngặt quy định bảo vệ quyền riêng tư học sinh tiểu học, chỉ chia sẻ nội bộ phục vụ chuyên môn sư phạm.
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setLightboxItem(item)}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {item.category}
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm font-heading mt-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setLightboxItem(item)}
                  className="text-sky-600 hover:text-sky-700 font-bold text-[11px]"
                >
                  Phóng to ảnh &rarr;
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Xóa minh chứng"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600">{lightboxItem.category} • {lightboxItem.date}</span>
                <h3 className="text-lg font-black text-slate-800 font-heading">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {lightboxItem.description}
            </p>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-800 font-heading text-lg">
                Thêm Minh Chứng Triển Khai
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hoạt động:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiết học thực hành sơ đồ tư duy nhóm 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phân loại:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="Giáo viên hướng dẫn">Giáo viên hướng dẫn</option>
                  <option value="Học sinh thảo luận nhóm">Học sinh thảo luận nhóm</option>
                  <option value="Làm nhiệm vụ trên thiết bị">Làm nhiệm vụ trên thiết bị</option>
                  <option value="Trình bày sản phẩm">Trình bày sản phẩm</option>
                  <option value="Sơ đồ kiến thức">Sơ đồ kiến thức</option>
                  <option value="Nhật ký tiến bộ">Nhật ký tiến bộ</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ngày thực hiện:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả hoạt động:</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú ngắn về diễn biến, sự tiến bộ của học trò..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Đường dẫn ảnh (URL hoặc để trống dùng mẫu):</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white font-bold shadow-md shadow-sky-200"
                >
                  Lưu minh chứng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

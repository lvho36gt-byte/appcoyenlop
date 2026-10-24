import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Video,
  Brain,
  Download,
  Sparkles,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { SubjectType } from '../../types';

interface ResourceItem {
  id: string;
  title: string;
  subject: SubjectType;
  week: number;
  type: 'Kiến thức trọng tâm' | 'Phiếu học tập' | 'Trắc nghiệm AI' | 'Sơ đồ tư duy' | 'Luyện thi chuyển cấp';
  description: string;
  keyPoints: string[];
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Chuyên đề Phân số & Các phép tính phân số',
    subject: 'Toán',
    week: 2,
    type: 'Kiến thức trọng tâm',
    description: 'Tổng hợp quy tắc quy đồng mẫu số, cộng trừ nhân chia phân số và bài toán tìm phân số của một số.',
    keyPoints: ['Quy đồng mẫu số chung nhỏ nhất', 'Rút gọn phân số tối giản', 'Phép nhân, chia nghịch đảo'],
    level: 'Cơ bản',
  },
  {
    id: 'res-2',
    title: 'Phiếu luyện tập: Toán chuyển động đều s = v × t',
    subject: 'Toán',
    week: 16,
    type: 'Phiếu học tập',
    description: 'Bộ 10 bài toán chuyển động cùng chiều, ngược chiều và chuyển động trên dòng nước.',
    keyPoints: ['Công thức s = v × t', 'Quy đổi đơn vị giờ - phút', 'Chuyển động xuôi/ngược dòng'],
    level: 'Nâng cao',
  },
  {
    id: 'res-3',
    title: 'Sổ tay Từ đồng nghĩa & Luyện câu ghép',
    subject: 'Tiếng Việt',
    week: 4,
    type: 'Kiến thức trọng tâm',
    description: 'Hệ thống từ đồng nghĩa chỉ đức tính, màu sắc, hình dáng và các cách nối các vế câu ghép.',
    keyPoints: ['Từ đồng nghĩa hoàn toàn & không hoàn toàn', 'Nối câu bằng từ ngữ nối', 'Nối bằng cặp quan hệ từ'],
    level: 'Trung bình',
  },
  {
    id: 'res-4',
    title: 'Sơ đồ tư duy: Năng lượng và Sử dụng năng lượng an toàn',
    subject: 'Khoa học',
    week: 8,
    type: 'Sơ đồ tư duy',
    description: 'Sơ đồ hình ảnh tổng hợp năng lượng mặt trời, gió, nước chảy, điện năng và các biện pháp tiết kiệm.',
    keyPoints: ['Nguồn năng lượng tái tạo', 'Biện pháp an toàn điện', 'Tiết kiệm năng lượng gia đình'],
    level: 'Cơ bản',
  },
  {
    id: 'res-5',
    title: 'Tuyên ngôn Độc lập & Kháng chiến toàn quốc',
    subject: 'Lịch sử và Địa lí',
    week: 12,
    type: 'Kiến thức trọng tâm',
    description: 'Diễn biến và ý nghĩa lịch sử ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử.',
    keyPoints: ['Bác Hồ đọc Tuyên ngôn Độc lập', 'Ý nghĩa ngày Quốc khánh', 'Lời kêu gọi toàn quốc kháng chiến'],
    level: 'Trung bình',
  },
  {
    id: 'res-6',
    title: 'Bộ đề tổng hợp sẵn sàng chuyển cấp vào Lớp 6',
    subject: 'Toán',
    week: 35,
    type: 'Luyện thi chuyển cấp',
    description: 'Đề ôn tập tổng hợp năng lực toán học chuẩn bị hành trang vững vàng bước vào trường THCS.',
    keyPoints: ['Số học & Phân số', 'Hình học diện tích, thể tích', 'Giải toán có lời văn'],
    level: 'Nâng cao',
  },
];

export const DigitalLibrary: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Tất cả');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewItem, setViewItem] = useState<ResourceItem | null>(null);

  const filtered = RESOURCES.filter((item) => {
    const matchSubj = selectedSubject === 'Tất cả' || item.subject === selectedSubject;
    const matchWeek = selectedWeek === 'all' || item.week === selectedWeek;
    const matchType = selectedType === 'Tất cả' || item.type === selectedType;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchWeek && matchType && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Chương Trình GDPT 2018 (Bộ Kết Nối Tri Thức)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
            Kho Học Liệu Số Lớp 5
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tài liệu số hóa 35 tuần học: Toán, Tiếng Việt, Khoa học, Lịch sử và Địa lí – Phục vụ tự học và ôn tập chuyển cấp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Tuần 1 &rarr; Tuần 35
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả môn học</option>
            <option value="Toán">Toán</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Lịch sử và Địa lí">Lịch sử & Địa lí</option>
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả loại học liệu</option>
            <option value="Kiến thức trọng tâm">Kiến thức trọng tâm</option>
            <option value="Phiếu học tập">Phiếu học tập</option>
            <option value="Sơ đồ tư duy">Sơ đồ tư duy</option>
            <option value="Luyện thi chuyển cấp">Luyện thi chuyển cấp</option>
          </select>
        </div>

        <div>
          <select
            value={selectedWeek === 'all' ? 'all' : String(selectedWeek)}
            onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
          >
            <option value="all">Tất cả các tuần (1 - 35)</option>
            <option value="2">Tuần 2</option>
            <option value="4">Tuần 4</option>
            <option value="8">Tuần 8</option>
            <option value="12">Tuần 12</option>
            <option value="16">Tuần 16</option>
            <option value="35">Tuần 35 (Chuyển cấp)</option>
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {item.subject}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Tuần {item.week} • {item.level}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm font-heading mt-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Trọng tâm:</div>
                {item.keyPoints.map((p, i) => (
                  <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{item.type}</span>
              <button
                onClick={() => setViewItem(item)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold transition-colors"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600">
                  {viewItem.subject} • Tuần {viewItem.week}
                </span>
                <h3 className="text-lg font-black text-slate-800 font-heading">
                  {viewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {viewItem.description}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Kiến thức và năng lực cần đạt:</div>
              {viewItem.keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{kp}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-200"
              >
                <Download className="w-4 h-4" />
                <span>In / Tải phiếu học tập</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useRef } from 'react';
import {
  X,
  Printer,
  Award,
  Star,
  CheckCircle,
  Calendar,
  Compass,
  Sparkles,
  School,
  Heart,
} from 'lucide-react';
import { Student } from '../../types';
import { INITIAL_BADGES } from '../../data/initialData';

interface ProgressCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: Student;
}

export const ProgressCardModal: React.FC<ProgressCardModalProps> = ({
  isOpen,
  onClose,
  activeStudent,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintCard = () => {
    window.print();
  };

  const unlockedBadges = INITIAL_BADGES.filter((b) => activeStudent.badges.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-sky-200">
        {/* Header - Not printed */}
        <div className="no-print bg-gradient-to-r from-[#1689F8] to-sky-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🪪
            </div>
            <div>
              <h3 className="text-lg font-black font-heading leading-tight">
                THẺ TIẾN BỘ ĐIỆN TỬ (MY PROGRESS CARD)
              </h3>
              <p className="text-xs text-sky-100">
                Bản ghi nhận nỗ lực cá nhân chuẩn bị chuyển cấp THCS • Lớp 5B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Content */}
        <div className="p-6 overflow-y-auto space-y-5 print-card" ref={cardRef}>
          {/* Card Formal Header */}
          <div className="border-b-2 border-sky-500 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1 • NĂM HỌC 2026–2027
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-sky-700 font-heading">
                PHIẾU THEO DÕI TIẾN BỘ CÁ NHÂN HÓA
              </h2>
              <div className="text-xs text-slate-600">
                Đề tài: AI Bản Đồ Nhiệm Vụ • Giáo viên chủ nhiệm: <strong>Cô Lê Thị Yến</strong>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-lg">
                Lớp 5B
              </span>
            </div>
          </div>

          {/* Student Profile Identity Section */}
          <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-emerald-50 p-4 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center text-5xl shadow-md shrink-0">
              {activeStudent.avatar}
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-black text-slate-800 font-heading">
                  {activeStudent.name}
                </h3>
                <span className="bg-sky-200 text-sky-900 font-bold text-xs px-2 py-0.5 rounded-md">
                  Mã số: {activeStudent.code}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Khẩu hiệu: <em>“Chăm chỉ tự học – Sẵn sàng tự tin bước vào lớp 6”</em>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {activeStudent.points} Điểm Tích Lũy
                </span>
                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  {activeStudent.completedMissions.length} Nhiệm vụ hoàn thành
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  +{((activeStudent.postTestScore || 8.5) - (activeStudent.preTestScore || 6.5)).toFixed(1)} Mức Tăng Điểm
                </span>
              </div>
            </div>
          </div>

          {/* 5 Core Competencies Evaluation */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Đánh Giá Mức Độ Đạt 5 Nhóm Năng Lực Cốt Lõi (GDPT 2018)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>1. Năng lực Kiến thức môn học</span>
                  <span className="font-bold text-blue-600">{activeStudent.competencies.knowledge}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${activeStudent.competencies.knowledge}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>2. Kỹ năng giải quyết vấn đề</span>
                  <span className="font-bold text-emerald-600">{activeStudent.competencies.skills}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${activeStudent.competencies.skills}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>3. Năng lực tự học & tự quản</span>
                  <span className="font-bold text-purple-600">{activeStudent.competencies.selfStudy}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${activeStudent.competencies.selfStudy}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>4. Năng lực hợp tác & làm việc nhóm</span>
                  <span className="font-bold text-amber-600">{activeStudent.competencies.collaboration}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${activeStudent.competencies.collaboration}%` }}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>5. Tự tin & Sẵn sàng chuyển cấp THCS</span>
                  <span className="font-bold text-pink-600">{activeStudent.competencies.confidence}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full"
                    style={{ width: `${activeStudent.competencies.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned Showcase */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 font-heading">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Bộ Huy Hiệu Thành Tích Đã Mở Khóa ({unlockedBadges.length} / 8):</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {unlockedBadges.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center gap-2 text-xs"
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <div className="font-bold text-slate-800 leading-tight">{b.name}</div>
                    <div className="text-[10px] text-amber-800">Đã đạt</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Remark & Parent Acknowledgement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">
                Nhận xét của Giáo viên (Cô Lê Thị Yến):
              </span>
              <p className="text-slate-600 leading-relaxed italic">
                “{activeStudent.notes || 'Học sinh rất tích cực, chủ động tương tác với MapAI và tiến bộ rõ rệt trong tư duy giải toán.'}”
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">
                Ý kiến phối hợp của Phụ huynh:
              </span>
              <p className="text-slate-500 italic">
                Gia đình đã xem kết quả và sẽ tiếp tục đồng hành, khích lệ cháu tự học ở nhà theo hướng dẫn của cô giáo.
              </p>
              <div className="mt-4 pt-2 border-t border-dashed border-slate-300 text-right text-[10px] text-slate-400">
                (Ký và ghi rõ họ tên phụ huynh)
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls - No print */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            * Nhấn "In Thẻ Tiến Bộ" để tạo bản in đẹp gửi phụ huynh học sinh.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
            >
              Đóng
            </button>
            <button
              onClick={handlePrintCard}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-sky-200"
            >
              <Printer className="w-4 h-4" />
              <span>XUẤT THẺ TIẾN BỘ (IN / PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

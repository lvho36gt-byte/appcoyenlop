import React from 'react';
import { X, Compass, Sparkles, BookOpen, Brain, Users, Award, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-sky-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1689F8] to-sky-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              📘
            </div>
            <div>
              <h3 className="text-xl font-black font-heading leading-tight">
                HƯỚNG DẪN SỬ DỤNG AI BẢN ĐỒ NHIỆM VỤ
              </h3>
              <p className="text-xs text-sky-100">
                Cẩm nang dành cho Học sinh, Giáo viên và Phụ huynh Lớp 5B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Section 1: 5 Chặng hành trình */}
          <div>
            <h4 className="font-bold text-sky-700 text-base flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-sky-500" />
              1. Khám phá Bản Đồ 5 Chặng Học Tập
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="font-bold text-amber-800 text-sm block mb-1">
                  Chặng 1: Khám Phá Năng Lực 🎯
                </span>
                Làm bài trắc nghiệm chẩn đoán đầu vào để nhận biết điểm mạnh và mục tiêu cần phấn đấu (Toán, Tiếng Việt, Khoa học, Lịch sử).
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                <span className="font-bold text-blue-800 text-sm block mb-1">
                  Chặng 2: Hành Trình Tri Thức 🗺️
                </span>
                Thực hiện các nhiệm vụ theo tuần học. Nếu làm sai, AI sẽ hướng dẫn từng bước để bạn tự sửa và mở khóa nhiệm vụ tiếp theo.
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-800 text-sm block mb-1">
                  Chặng 3: MapAI – Bạn Học Tập 🤖
                </span>
                Trò chuyện cùng robot MapAI với 3 cấp độ gợi ý thông minh (Nhắc quy tắc &rarr; Ví dụ mẫu &rarr; Hướng dẫn bước giải). Có giọng đọc tiếng Việt!
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <span className="font-bold text-purple-800 text-sm block mb-1">
                  Chặng 4: Xưởng Sáng Tạo AI 🎨
                </span>
                Tạo sơ đồ tư duy tương tác thực sự (4 kiểu: Tỏa tròn, Cây, Xương cá, Dòng thời gian), kéo thả nút, đổi màu và xuất ảnh PNG hoặc in PDF.
              </div>
              <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 md:col-span-2">
                <span className="font-bold text-pink-800 text-sm block mb-1">
                  Chặng 5: Nhật Ký Tiến Bộ 📖
                </span>
                Mỗi ngày trả lời 3 câu hỏi (Hôm nay học gì? Khó khăn gì? Ngày mai cố gắng gì?) và chọn cảm xúc để nhận lời khen động viên từ AI.
              </div>
            </div>
          </div>

          {/* Section 2: 6 Hoạt động */}
          <div>
            <h4 className="font-bold text-emerald-700 text-base flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              2. Sáu Hoạt Động Học Sinh Nổi Bật
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">1. Mission Check-in:</strong> Khởi động 3 câu đầu buổi.
              </li>
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">2. AI Quiz:</strong> Đấu trường tri thức có tính giờ & pháo hoa.
              </li>
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">3. Mind Map:</strong> Sơ đồ tư duy AI xuất ảnh PNG.
              </li>
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">4. Peer Support:</strong> Thảo luận và nộp bài nhóm.
              </li>
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">5. My Progress Card:</strong> Thẻ tiến bộ điện tử in gửi phụ huynh.
              </li>
              <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">6. Reflection:</strong> Tự đánh giá năng lực tự học.
              </li>
            </ul>
          </div>

          {/* Section 3: Quy tắc điểm & Huy hiệu */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              Hệ Thống Huy Hiệu & Điểm Thưởng Khích Lệ
            </h4>
            <p className="text-amber-800 leading-relaxed">
              • Hoàn thành nhiệm vụ: <strong>+10 điểm</strong> | Làm xuất sắc: <strong>+5 điểm</strong> | Viết nhật ký: <strong>+5 điểm</strong> | Sáng tạo sản phẩm: <strong>+20 điểm</strong>.
              <br />
              • Hệ thống chú trọng mức tăng trưởng tiến bộ và tính chuyên cần, không so sánh tiêu cực giữa các bạn học sinh.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#1689F8] text-white font-bold hover:bg-blue-600 shadow-md shadow-sky-200 transition-all text-xs"
          >
            Đã hiểu, bắt đầu khám phá ngay! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Heart,
  Smile,
  Award,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Star,
  Printer,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Student, ParentFeedback } from '../../types';
import { storageService } from '../../services/storageService';

interface ParentPortalProps {
  activeStudent: Student;
  onOpenProgressCard: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  activeStudent,
  onOpenProgressCard,
}) => {
  const [feedbackList, setFeedbackList] = useState<ParentFeedback[]>(() =>
    storageService.getParentFeedback()
  );
  const [parentName, setParentName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    const newFb: ParentFeedback = {
      id: `fb-${Date.now()}`,
      studentId: activeStudent.id,
      parentName: parentName.trim() || `Phụ huynh em ${activeStudent.name}`,
      message: feedbackMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'Đã gửi',
    };

    storageService.addParentFeedback(newFb);
    setFeedbackList(storageService.getParentFeedback());
    setFeedbackMessage('');
    setParentName('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FF9635] via-amber-500 to-[#1689F8] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>Khu Vực Phụ Huynh Đồng Hành • Lớp 5B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            ĐỒNG HÀNH CÙNG CON CHINH PHỤC LỚP 5
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xl leading-relaxed">
            Học sinh đang xem: <strong>{activeStudent.name}</strong> • Kênh kết nối gia đình và nhà trường, nắm bắt tiến trình học tập và nhận gợi ý hỗ trợ con tại nhà.
          </p>
        </div>

        <button
          onClick={onOpenProgressCard}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 font-black text-xs shadow-md shadow-black/10 transition-all self-start md:self-auto font-heading"
        >
          <Printer className="w-4 h-4 text-orange-500" />
          <span>XEM & IN THẺ TIẾN BỘ CỦA CON</span>
        </button>
      </div>

      {/* Safety notice */}
      <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-xs text-sky-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
        <span>
          <strong>Bảo mật thông tin:</strong> Hệ thống sử dụng chế độ trải nghiệm minh họa cho phụ huynh, bảo vệ quyền riêng tư và danh tính của học sinh lớp 5B.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progress summary & Strengths */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time stats */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm font-heading">
                Tình hình học tập tuần này của {activeStudent.name}
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Tích cực tự học
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xl font-black text-amber-600 font-heading">
                  {activeStudent.points}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">Điểm tích lũy</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xl font-black text-blue-600 font-heading">
                  {activeStudent.completedMissions.length}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">Nhiệm vụ xong</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xl font-black text-emerald-600 font-heading">
                  +{((activeStudent.postTestScore || 8.5) - (activeStudent.preTestScore || 6.5)).toFixed(1)}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">Mức tiến bộ</div>
              </div>
            </div>

            {/* Strengths and Focus Points */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Điểm mạnh nổi bật của con:</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Con rất tự giác ngồi vào bàn học và tự tin trả lời các câu hỏi về phân số, từ đồng nghĩa. Khi gặp bài toán khó, con biết hỏi trợ lý MapAI để tự tư duy tìm ra cách giải thay vì nản lòng.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Nội dung con cần rèn luyện thêm ở nhà:</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Con cần luyện tập thêm thao tác quy đổi đơn vị đo thời gian (giờ &rarr; phút &rarr; giây) trong bài toán chuyển động đều và tập thói quen đọc lại đề bài trước khi kết luận.
                </p>
              </div>
            </div>
          </div>

          {/* AI & Teacher Advice for Parents */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-sky-700 font-bold font-heading text-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Gợi Ý Của Cô Giáo & AI Hỗ Trợ Con Học Tại Nhà Không Áp Lực:</span>
            </div>
            <ul className="space-y-2 text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>Dành 15 - 20 phút mỗi tối:</strong> Lắng nghe con hào hứng kể lại hôm nay đã nhận được huy hiệu nào trên Bản Đồ Nhiệm Vụ.
              </li>
              <li>
                <strong>Khen ngợi nỗ lực thay vì điểm số tuyệt đối:</strong> Hãy khen: <em>“Ba/Mẹ rất tự hào vì con đã kiên trì suy nghĩ đến bước cuối cùng!”</em>
              </li>
              <li>
                <strong>Khuyến khích con vẽ sơ đồ tư duy:</strong> Cho con dùng giấy vẽ hoặc công cụ Xưởng sáng tạo để tóm tắt bài học Khoa học, Lịch sử thành hình ảnh sinh động.
              </li>
              <li>
                <strong>Tạo môi trường chuẩn bị chuyển cấp:</strong> Rèn luyện cho con tính tự giác chuẩn bị sách vở và quản lý thời gian để tự tin bước vào lớp 6.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Parent feedback to Teacher */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold font-heading text-sm">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Gửi Phản Hồi Cho Cô Giáo Chủ Nhiệm (Cô Lê Thị Yến)</span>
            </div>

            <form onSubmit={handleSendFeedback} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Họ tên phụ huynh:
                </label>
                <input
                  type="text"
                  placeholder={`Phụ huynh em ${activeStudent.name}`}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ý kiến đóng góp / Chia sẻ về tình hình học ở nhà của con:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ví dụ: Cháu ở nhà rất thích thú khi được MapAI khen ngợi, gia đình cảm ơn cô Yến rất nhiều..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF9635] hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Tin Nhắn Cho Cô Yến</span>
              </button>

              {sentSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold text-center animate-fadeIn">
                  ✓ Tin nhắn của quý phụ huynh đã được gửi đến cô giáo chủ nhiệm!
                </div>
              )}
            </form>
          </div>

          {/* Messages history */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-heading">
              Ý Kiến Phối Hợp Giáo Dục Đã Gửi:
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-bold text-slate-700">{fb.parentName}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {fb.date}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">“{fb.message}”</p>
                  <div className="text-[10px] text-emerald-600 font-semibold pt-1">
                    ✓ {fb.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  Award,
  Heart,
  School,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Calendar,
  Users,
} from 'lucide-react';

interface TeacherProfileProps {
  onBackToMap: () => void;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ onBackToMap }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const handleUpdateAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setAvatarUrl(inputUrl.trim());
      setShowChangeAvatar(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-sky-100 overflow-hidden relative">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/60 via-emerald-100/40 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar / Portrait */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-[#1689F8] to-emerald-400 p-1.5 shadow-xl shadow-sky-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Cô Lê Thị Yến"
                    className="w-full h-full object-cover rounded-2xl bg-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-sky-50 to-blue-100 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-6xl sm:text-7xl mb-1">👩‍🏫</span>
                    <span className="text-[11px] font-bold text-sky-800 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
                      Cô Lê Thị Yến
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowChangeAvatar(!showChangeAvatar)}
                className="absolute -bottom-2 right-2 bg-white text-slate-700 hover:text-sky-600 p-2 rounded-xl border border-slate-200 shadow-md text-xs font-bold flex items-center gap-1 transition-all"
                title="Thay đổi ảnh chân dung"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[10px]">Đổi ảnh</span>
              </button>
            </div>

            {showChangeAvatar && (
              <form onSubmit={handleUpdateAvatar} className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 w-full animate-fadeIn">
                <input
                  type="text"
                  placeholder="Dán link ảnh chân dung (URL)..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-[#1689F8] text-white font-bold text-[11px]"
                >
                  Cập nhật ảnh
                </button>
              </form>
            )}
          </div>

          {/* Teacher Credentials & Pedagogical Bio */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>NGƯỜI KIẾN TẠO HÀNH TRÌNH</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 font-heading">
                Cô Lê Thị Yến
              </h2>
              <div className="text-sm font-bold text-sky-700 mt-1">
                Giáo viên Chủ nhiệm Lớp 5B • Trường Tiểu học Khoái Châu 1
              </div>
            </div>

            {/* Credential items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <School className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Đơn vị công tác</div>
                  <div className="font-bold text-slate-800">Trường Tiểu học Khoái Châu 1</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Lớp triển khai</div>
                  <div className="font-bold text-slate-800">Lớp 5B (Năm học 2026 – 2027)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Sản phẩm EdTech</div>
                  <div className="font-bold text-slate-800">AI Bản Đồ Nhiệm Vụ Lớp 5</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Mục tiêu cốt lõi</div>
                  <div className="font-bold text-slate-800">Cá nhân hóa – Sẵn sàng chuyển cấp</div>
                </div>
              </div>
            </div>

            {/* Pedagogical statement */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-2">
              <div className="font-bold text-sky-900 text-sm flex items-center gap-1.5 font-heading">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>Tâm Huyết & Triết Lý Giáo Dục:</span>
              </div>
              <p className="leading-relaxed italic">
                “Lớp 5 là năm học bản lề đặc biệt quan trọng trước khi các em bước vào cánh cổng trường THCS. Ứng dụng AI Bản Đồ Nhiệm Vụ được ra đời từ mong ước mỗi bạn nhỏ đều có một con đường tiến bộ riêng, học tập đầy hào hứng, không áp lực và tự tin làm chủ tương lai.”
              </p>
              <div className="text-right font-bold text-sky-800">
                — Cô Lê Thị Yến
              </div>
            </div>

            <div className="pt-2 flex justify-center md:justify-start">
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all"
              >
                Trở về Bản Đồ 5 Chặng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

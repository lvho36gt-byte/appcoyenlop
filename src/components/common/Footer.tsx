import React from 'react';
import { Compass, Heart, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface FooterProps {
  onOpenTeacherProfile: () => void;
  onOpenHelp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeacherProfile, onOpenHelp }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t-4 border-[#1689F8] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Slogan */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1689F8] to-emerald-400 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-heading tracking-wide">
                AI BẢN ĐỒ NHIỆM VỤ
              </span>
            </div>
            <p className="text-sm text-sky-300 font-semibold italic">
              "Kiến tạo hành trình chinh phục lớp 5 – Sẵn sàng chuyển cấp THCS"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Thông điệp giáo dục: <span className="text-white font-medium">“AI là công cụ dẫn đường, học sinh là trung tâm của hành trình tiến bộ.”</span> Khuyến khích tư duy phản biện, năng lực tự học và tinh thần hợp tác của học sinh tiểu học.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo mật an toàn cho học sinh • Không thu thập dữ liệu định danh nhạy cảm</span>
            </div>
          </div>

          {/* Product & Teacher info */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Thông tin đề tài
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>
                <span className="text-slate-300 font-medium">Giáo viên thực hiện:</span> Cô Lê Thị Yến
              </li>
              <li>
                <span className="text-slate-300 font-medium">Đơn vị:</span> Trường Tiểu học Khoái Châu 1
              </li>
              <li>
                <span className="text-slate-300 font-medium">Lớp triển khai:</span> Lớp 5B
              </li>
              <li>
                <span className="text-slate-300 font-medium">Năm học:</span> 2026 – 2027
              </li>
              <li>
                <span className="text-slate-300 font-medium">Chương trình:</span> GDPT 2018 (Kết nối tri thức)
              </li>
            </ul>
            <button
              onClick={onOpenTeacherProfile}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline inline-flex items-center gap-1 pt-1"
            >
              Xem thông tin người kiến tạo &rarr;
            </button>
          </div>

          {/* Quick links & Support */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Trợ giúp & Nguyên tắc
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors">
                  📘 Hướng dẫn sử dụng chi tiết
                </button>
              </li>
              <li>
                <span className="text-slate-400">🌱 Nguyên tắc 3 cấp độ gợi ý AI</span>
              </li>
              <li>
                <span className="text-slate-400">⭐ Đánh giá vì sự tiến bộ của học trò</span>
              </li>
              <li>
                <span className="text-slate-400">🧩 Bản đồ 5 chặng phát triển năng lực</span>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-amber-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Tôn vinh nỗ lực cá nhân từng ngày!</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026–2027 AI Bản Đồ Nhiệm Vụ • Lớp 5B Trường Tiểu học Khoái Châu 1</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Đồng hành cùng học sinh lớp 5</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>vững bước chuyển cấp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

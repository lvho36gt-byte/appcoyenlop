import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Award,
  Star,
  ChevronRight,
  School,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { Student } from '../../types';
import { aiService } from '../../services/aiService';

interface HeroMapProps {
  activeStudent: Student;
  onSelectStage: (stageId: number) => void;
  onOpenCheckIn: () => void;
  onOpenQuiz: () => void;
  onOpenProgressCard: () => void;
  onNavigateTab: (tab: string) => void;
  soundEnabled: boolean;
}

export const HeroMap: React.FC<HeroMapProps> = ({
  activeStudent,
  onSelectStage,
  onOpenCheckIn,
  onOpenQuiz,
  onOpenProgressCard,
  onNavigateTab,
  soundEnabled,
}) => {
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const welcomeText =
    'Xin chào! Mình là MapAI, người bạn đồng hành của bạn trên hành trình chinh phục lớp 5. Hôm nay chúng mình cùng hoàn thành những thử thách thú vị nhé!';

  const handleSpeakWelcome = () => {
    if (isPlayingSpeech) {
      aiService.stopSpeaking();
      setIsPlayingSpeech(false);
    } else {
      setIsPlayingSpeech(true);
      aiService.speakVietnamese(welcomeText);
      setTimeout(() => setIsPlayingSpeech(false), 8000);
    }
  };

  const stages = [
    {
      id: 1,
      title: 'Khám Phá Năng Lực',
      subtitle: 'Chẩn đoán đầu vào',
      color: '#FF9635', // Cam
      bgGradient: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: '🎯',
      description: 'Đánh giá kiến thức 4 môn theo mức độ nhận thức, xác định điểm mạnh và mục tiêu.',
      stepNumber: 'CHẶNG 1',
      completed: (activeStudent.preTestScore || 0) > 0,
    },
    {
      id: 2,
      title: 'Hành Trình Tri Thức',
      subtitle: 'Nhiệm vụ theo chặng',
      color: '#1689F8', // Xanh dương
      bgGradient: 'from-sky-400 to-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '🗺️',
      description: 'Luyện tập theo tuần (Toán, Tiếng Việt, Khoa học, Sử-Địa) với phản hồi AI thông minh.',
      stepNumber: 'CHẶNG 2',
      completed: activeStudent.completedMissions.length >= 2,
    },
    {
      id: 3,
      title: 'MapAI – Bạn Học Tập',
      subtitle: 'Trạm hỗ trợ thông minh',
      color: '#22C55E', // Xanh lá
      bgGradient: 'from-emerald-400 to-green-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: '🤖',
      description: 'Gia sư AI 3 cấp độ gợi ý, giải thích thân thiện, phát âm giọng nói chuẩn.',
      stepNumber: 'CHẶNG 3',
      completed: true,
    },
    {
      id: 4,
      title: 'Xưởng Sáng Tạo AI',
      subtitle: 'Sản phẩm chinh phục',
      color: '#9254DE', // Tím
      bgGradient: 'from-purple-400 to-indigo-600',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: '🎨',
      description: 'Công cụ vẽ Sơ đồ tư duy đa dạng kiểu dáng, kéo thả trực quan và xuất ảnh PNG / In PDF.',
      stepNumber: 'CHẶNG 4',
      completed: activeStudent.points > 100,
    },
    {
      id: 5,
      title: 'Hành Trình Trưởng Thành',
      subtitle: 'Nhật ký tiến bộ',
      color: '#FF5FA2', // Hồng
      bgGradient: 'from-pink-400 to-rose-500',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
      icon: '📖',
      description: 'Viết nhật ký 3 câu hỏi mỗi ngày, chọn cảm xúc và nhận lời khen tạo động lực từ AI.',
      stepNumber: 'CHẶNG 5',
      completed: activeStudent.completedMissions.length >= 3,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1689F8] via-sky-500 to-[#22C55E] text-white p-6 sm:p-10 shadow-xl shadow-sky-200/50 border-4 border-white">
        {/* Background decorative animated clouds and circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Mascot Robot & Students */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative">
              {/* Cute 3D Robot Card */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-white via-sky-50 to-blue-100 p-2 shadow-2xl flex items-center justify-center animate-float border-4 border-sky-300">
                <div className="relative flex flex-col items-center">
                  <div className="text-6xl sm:text-7xl">🤖</div>
                  <div className="mt-1 flex items-center gap-1 bg-[#1689F8] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>Robot MapAI</span>
                  </div>
                </div>
              </div>

              {/* Floating companion badges */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 px-2.5 py-1 rounded-xl font-black text-xs shadow-md animate-bounce-subtle flex items-center gap-1">
                ⭐ Lớp 5B
              </div>
              <div className="absolute bottom-2 -left-3 bg-white text-sky-800 px-2.5 py-1 rounded-xl font-bold text-[11px] shadow-md flex items-center gap-1">
                🎒 Khăn quàng đỏ
              </div>
            </div>

            {/* Speech bubble for MapAI */}
            <div className="mt-4 relative bg-white text-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-lg border-2 border-sky-100 max-w-sm">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t-2 border-l-2 border-sky-100" />
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                “{welcomeText}”
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <button
                  onClick={handleSpeakWelcome}
                  className="flex items-center gap-1.5 px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-full text-xs font-bold transition-colors"
                >
                  {isPlayingSpeech ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      <span>Dừng đọc giọng MapAI</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Nghe MapAI chào bằng giọng đọc 🔊</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Title, Slogan, and 3 Main CTA Buttons */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-xs">
              <Compass className="w-4 h-4 text-yellow-300" />
              <span>HÀNH TRÌNH CHINH PHỤC LỚP 5 • TRƯỜNG TH KHOÁI CHÂU 1</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight text-white drop-shadow-sm">
              AI BẢN ĐỒ NHIỆM VỤ
            </h2>

            <p className="text-lg sm:text-xl font-bold text-yellow-200 font-heading">
              KIẾN TẠO HÀNH TRÌNH CHINH PHỤC LỚP 5
            </p>

            {/* Slogans */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20 space-y-1">
              <div className="text-sm font-bold text-white">
                “Cá nhân hóa mục tiêu – Tăng tự học – Sẵn sàng chuyển cấp THCS”
              </div>
              <div className="text-xs text-sky-100 italic">
                “AI là công cụ dẫn đường, học sinh là trung tâm của hành trình tiến bộ.”
              </div>
            </div>

            {/* 3 Main Action Buttons requested in section IV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onSelectStage(1)}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-heading"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>BẮT ĐẦU HÀNH TRÌNH</span>
              </button>

              <button
                onClick={() => onNavigateTab('teacher-dashboard')}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-heading"
              >
                <School className="w-4 h-4" />
                <span>KHÔNG GIAN GIÁO VIÊN</span>
              </button>

              <button
                onClick={() => onNavigateTab('parent-portal')}
                className="flex items-center justify-center gap-2 bg-white hover:bg-sky-50 text-sky-800 font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-heading"
              >
                <Smile className="w-4 h-4 text-orange-500" />
                <span>PHỤ HUYNH ĐỒNG HÀNH</span>
              </button>
            </div>

            {/* Quick student stat badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-white/90">
              <div className="bg-white/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <span>Học sinh:</span>
                <span className="font-bold text-yellow-200">{activeStudent.name}</span>
                <span>({activeStudent.code})</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>{activeStudent.points} điểm tích lũy</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeStudent.badges.length} huy hiệu đã đạt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Activities Bar (Section VI) */}
      <section className="bg-white rounded-3xl p-6 shadow-md border border-sky-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              SÁU HOẠT ĐỘNG HỌC SINH TƯƠNG TÁC
            </h3>
            <p className="text-xs text-slate-500">
              Các thẻ chức năng thực tế giúp học sinh tự học, hợp tác và đo lường sự tiến bộ
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('activities')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Xem chi tiết cả 6 hoạt động</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <button
            onClick={onOpenCheckIn}
            className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
            <div className="text-xs font-bold text-orange-950 font-heading">1. Mission Check-in</div>
            <div className="text-[11px] text-orange-700">Khởi động 3 câu</div>
          </button>

          <button
            onClick={onOpenQuiz}
            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
            <div className="text-xs font-bold text-amber-950 font-heading">2. AI Quiz</div>
            <div className="text-[11px] text-amber-700">Đấu trường tri thức</div>
          </button>

          <button
            onClick={() => onSelectStage(4)}
            className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧠</div>
            <div className="text-xs font-bold text-purple-950 font-heading">3. Mind Map</div>
            <div className="text-[11px] text-purple-700">Sơ đồ tư duy AI</div>
          </button>

          <button
            onClick={() => onNavigateTab('activities')}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🤝</div>
            <div className="text-xs font-bold text-emerald-950 font-heading">4. Peer Support</div>
            <div className="text-[11px] text-emerald-700">Cùng bạn tiến bộ</div>
          </button>

          <button
            onClick={onOpenProgressCard}
            className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🪪</div>
            <div className="text-xs font-bold text-sky-950 font-heading">5. Progress Card</div>
            <div className="text-[11px] text-sky-700">Thẻ tiến bộ in ấn</div>
          </button>

          <button
            onClick={() => onSelectStage(5)}
            className="p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-left transition-all hover:-translate-y-1 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">💭</div>
            <div className="text-xs font-bold text-pink-950 font-heading">6. Reflection</div>
            <div className="text-[11px] text-pink-700">Tự đánh giá ngày</div>
          </button>
        </div>
      </section>

      {/* Visual Interactive 5-Stage Mission Map Section */}
      <section className="bg-gradient-to-b from-sky-50 via-emerald-50/40 to-sky-100/50 rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-200/80 relative">
        {/* Map Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>BẢN ĐỒ 5 CHẶNG HỌC TẬP</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading">
            CON ĐƯỜNG CHINH PHỤC LỚP 5
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Từ điểm xuất phát <span className="font-bold text-sky-700">Trường Tiểu học Khoái Châu 1</span> qua 5 trạm phát triển năng lực đến vạch đích <span className="font-bold text-emerald-700">Trường THCS</span>. Nhấn vào từng trạm để trải nghiệm ngay!
          </p>
        </div>

        {/* Departure & Destination Banner */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-sky-100 mb-8 text-xs font-bold shadow-xs">
          <div className="flex items-center gap-2 text-sky-800">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-base">
              🏫
            </div>
            <div>
              <div className="text-[10px] text-sky-500 uppercase">Điểm Xuất Phát</div>
              <div className="font-heading text-sm">Trường Tiểu học Khoái Châu 1</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-normal">
            <span>Đường đi quanh co</span>
            <div className="w-16 border-t-2 border-dashed border-sky-300" />
            <span>5 Trạm Tri Thức</span>
            <div className="w-16 border-t-2 border-dashed border-emerald-300" />
          </div>

          <div className="flex items-center gap-2 text-emerald-800 text-right">
            <div>
              <div className="text-[10px] text-emerald-600 uppercase">Đích Đến Thành Công</div>
              <div className="font-heading text-sm">Sẵn Sàng Chuyển Cấp THCS</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-base">
              🎓
            </div>
          </div>
        </div>

        {/* The 5 Interactive Stages Grid & Connected Trail */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {stages.map((st, idx) => {
            return (
              <div
                key={st.id}
                onClick={() => onSelectStage(st.id)}
                className="group relative bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-2 hover:border-[#1689F8] transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Step pill */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${st.badgeBg}`}
                  >
                    {st.stepNumber}
                  </span>
                  {st.completed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đạt</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold">Chưa xong</span>
                  )}
                </div>

                {/* Big mascot icon */}
                <div className="text-center my-2">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr ${st.bgGradient} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}
                  >
                    {st.icon}
                  </div>
                  <h4 className="mt-3 font-black text-slate-800 font-heading text-base leading-tight group-hover:text-sky-600 transition-colors">
                    {st.title}
                  </h4>
                  <div className="text-xs font-bold text-sky-700 mt-0.5">{st.subtitle}</div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed text-center mt-2 line-clamp-3">
                  {st.description}
                </p>

                {/* Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="w-full py-2 rounded-xl bg-slate-100 group-hover:bg-[#1689F8] group-hover:text-white text-slate-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors">
                    <span>Mở trạm {st.id}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  GraduationCap,
  Users,
  Award,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Info,
  Camera,
  UserCheck,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { Student, UserRole } from '../../types';
import { storageService } from '../../services/storageService';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  onOpenHelp: () => void;
  onResetData: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeStudent,
  allStudents,
  onSelectStudent,
  soundEnabled,
  setSoundEnabled,
  onOpenHelp,
  onResetData,
  currentTab,
  setCurrentTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const navItems = [
    { id: 'map', label: 'Bản Đồ 5 Chặng', icon: Compass },
    { id: 'activities', label: '6 Hoạt Động', icon: Sparkles },
    { id: 'library', label: 'Kho Học Liệu Lớp 5', icon: BookOpen },
    { id: 'impact', label: 'Tác Động GD', icon: FileText },
    { id: 'evidence', label: 'Minh Chứng Triển Khai', icon: Camera },
    { id: 'teacher-profile', label: 'Người Kiến Tạo', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      {/* Top micro bar for school and class info */}
      <div className="bg-linear-to-r from-[#1689F8] via-[#22C55E] to-[#FF9635] text-white py-1 px-4 text-xs font-medium flex justify-between items-center">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold tracking-wide">Trường Tiểu học Khoái Châu 1</span>
          <span>•</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px]">Lớp 5B (2026–2027)</span>
          <span>•</span>
          <span>GV: Lê Thị Yến</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <span className="bg-black/15 px-2 py-0.5 rounded-full font-medium">
            💡 "Cá nhân hóa mục tiêu – Tăng tự học – Sẵn sàng chuyển cấp THCS"
          </span>
          <span className="text-yellow-200">Dữ liệu minh họa GDPT 2018</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* App Title & Mascot icon */}
        <div
          onClick={() => setCurrentTab('map')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1689F8] to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] shadow-xs">
              🤖
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-sky-700 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                AI BẢN ĐỒ NHIỆM VỤ
              </h1>
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                Lớp 5
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Kiến tạo hành trình chinh phục lớp 5 cùng MapAI
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-sky-600 shadow-xs'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Role switcher + Student Info + Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role selector pill */}
          <div className="flex items-center bg-sky-50 border border-sky-200 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setCurrentRole('student');
                if (currentTab === 'teacher-dashboard') setCurrentTab('map');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'student'
                  ? 'bg-[#1689F8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
              title="Không gian học sinh"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Học sinh</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('teacher');
                setCurrentTab('teacher-dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'teacher'
                  ? 'bg-[#22C55E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
              title="Trung tâm điều hành giáo viên"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giáo viên</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('parent');
                setCurrentTab('parent-portal');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'parent'
                  ? 'bg-[#FF9635] text-white shadow-xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
              title="Phụ huynh đồng hành"
            >
              <span>👨‍👩‍👧</span>
              <span className="hidden sm:inline">Phụ huynh</span>
            </button>
          </div>

          {/* Student Profile dropdown pill (in student/parent mode) */}
          {currentRole !== 'teacher' && (
            <div className="relative group">
              <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 pl-2 pr-3 py-1 rounded-xl cursor-pointer shadow-xs transition-colors">
                <span className="text-lg">{activeStudent.avatar}</span>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {activeStudent.name}
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                    <Award className="w-2.5 h-2.5 text-amber-500 inline" />
                    <span>{activeStudent.points} điểm</span>
                    <span className="text-slate-300">|</span>
                    <span>{activeStudent.badges.length} huy hiệu</span>
                  </div>
                </div>
              </div>

              {/* Student selector menu on hover / click */}
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1">
                  Đổi học sinh trải nghiệm (5B):
                </div>
                {allStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onSelectStudent(st.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                      st.id === activeStudent.id
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{st.avatar}</span>
                      <div>
                        <div>{st.name}</div>
                        <div className="text-[10px] text-slate-400">{st.code}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-600">{st.points}đ</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action icon buttons */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={toggleFullScreen}
              title="Toàn màn hình trình chiếu"
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHelp}
              title="Hướng dẫn sử dụng"
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Info className="w-4 h-4 text-sky-600" />
            </button>

            <button
              onClick={onResetData}
              title="Khôi phục dữ liệu mẫu"
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg lg:hidden hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

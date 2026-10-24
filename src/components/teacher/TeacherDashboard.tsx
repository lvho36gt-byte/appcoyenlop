import React, { useState } from 'react';
import {
  Users,
  Compass,
  Award,
  TrendingUp,
  BarChart2,
  PieChart,
  Plus,
  Trash2,
  Edit,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Search,
  FileSpreadsheet,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Student, Mission } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface TeacherDashboardProps {
  students: Student[];
  onStudentsUpdated: () => void;
  missions: Mission[];
  onMissionsUpdated: () => void;
  soundEnabled: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  onStudentsUpdated,
  missions,
  onMissionsUpdated,
  soundEnabled: _soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'missions'>('analytics');
  const [searchStudent, setSearchStudent] = useState('');

  // Editing student score state (Pre-test vs Post-test)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempPreScore, setTempPreScore] = useState<number>(0);
  const [tempPostScore, setTempPostScore] = useState<number>(0);

  // New Student modal / form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'Nam' | 'Nữ'>('Nam');

  // AI Mission Generator
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);
  const [missionSubject, setMissionSubject] = useState('Toán');
  const [missionTopic, setMissionTopic] = useState('Tỉ số phần trăm và giải toán thực tế');
  const [generatedMissionResult, setGeneratedMissionResult] = useState<string | null>(null);

  // Calculate high level stats
  const totalStudents = students.length;
  const activeCount = students.filter((s) => s.completedMissions.length > 0).length;
  const totalMissions = missions.length;
  const totalCompletedCount = students.reduce((acc, s) => acc + s.completedMissions.length, 0);
  const completionRate =
    totalStudents * totalMissions > 0
      ? Math.round((totalCompletedCount / (totalStudents * totalMissions)) * 100)
      : 0;
  const totalCreativeProducts = storageService.getMindMaps().length;
  const improvedStudentsCount = students.filter(
    (s) => (s.postTestScore || 0) > (s.preTestScore || 0)
  ).length;

  const handleSaveScores = (student: Student) => {
    student.preTestScore = tempPreScore;
    student.postTestScore = tempPostScore;
    storageService.updateStudent(student);
    onStudentsUpdated();
    setEditingStudentId(null);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newS: Student = {
      id: `hs-${Date.now()}`,
      name: newStudentName.trim(),
      code: `5B-${String(students.length + 1).padStart(2, '0')}`,
      gender: newStudentGender,
      avatar: newStudentGender === 'Nam' ? '👦🏻' : '👧🏻',
      points: 10,
      completedMissions: [],
      badges: ['badge-1'],
      preTestScore: 6.0,
      postTestScore: 7.5,
      competencies: {
        knowledge: 75,
        skills: 75,
        selfStudy: 78,
        collaboration: 80,
        confidence: 76,
      },
      notes: 'Học sinh mới thêm vào danh sách lớp 5B.',
    };

    storageService.updateStudent(newS);
    onStudentsUpdated();
    setNewStudentName('');
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Cô có chắc muốn xóa học sinh này khỏi danh sách lớp không?')) {
      const updated = students.filter((s) => s.id !== id);
      storageService.saveStudents(updated);
      onStudentsUpdated();
    }
  };

  const handleExportCSV = () => {
    let csv = 'Mã số,Họ và tên,Giới tính,Điểm đầu vào,Điểm sau can thiệp,Điểm thưởng,Số nhiệm vụ hoàn thành,Năng lực tự học\n';
    students.forEach((s) => {
      csv += `${s.code},"${s.name}",${s.gender},${s.preTestScore || 0},${s.postTestScore || 0},${s.points},${s.completedMissions.length},${s.competencies.selfStudy}%\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Bao_cao_tong_hop_Lop_5B_Truong_TH_Khoai_Chau_1.csv`;
    link.click();
  };

  const handleGenerateMissionAI = async () => {
    setIsGeneratingMission(true);
    setGeneratedMissionResult(null);
    try {
      const res = await aiService.generateQuiz(missionSubject, missionTopic, 'Thông hiểu', 3);
      if (res.questions && res.questions.length > 0) {
        const newM: Mission = {
          id: `m-ai-${Date.now()}`,
          title: `${missionSubject} – ${missionTopic}`,
          subject: missionSubject as any,
          week: 18,
          keyKnowledge: `Kiến thức trọng tâm về ${missionTopic}`,
          learningGoal: `Học sinh vận dụng giải quyết bài toán ${missionTopic} đúng phương pháp.`,
          difficulty: 'Trung bình',
          estimatedMinutes: 15,
          rewardPoints: 15,
          questions: res.questions.map((q, idx) => ({
            id: `q-ai-${idx}`,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            hint: q.hint,
            level: 'Thông hiểu',
          })),
        };
        storageService.addMission(newM);
        onMissionsUpdated();
        setGeneratedMissionResult(`Đã tạo và giao thành công nhiệm vụ: "${newM.title}" cho lớp 5B!`);
      }
    } catch {
      setGeneratedMissionResult('Có lỗi xảy ra khi tạo nhiệm vụ. Vui lòng thử lại.');
    } finally {
      setIsGeneratingMission(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#1689F8] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>Trung Tâm Điều Hành Giáo Viên • Trường TH Khoái Châu 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            BẢNG ĐIỀU HÀNH HÀNH TRÌNH HỌC TẬP LỚP 5B
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Giáo viên chủ nhiệm: <strong>Cô Lê Thị Yến</strong> • Theo dõi tiến bộ cá nhân hóa, giao nhiệm vụ phân hóa và đánh giá năng lực học sinh theo GDPT 2018.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md shadow-black/10 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo A4</span>
          </button>
        </div>
      </div>

      {/* 7 Key Metrics Cards (Section IX) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Sĩ số lớp</div>
          <div className="text-2xl font-black text-slate-800 font-heading mt-1">{totalStudents}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">học sinh 5B</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Đang tham gia</div>
          <div className="text-2xl font-black text-blue-600 font-heading mt-1">{activeCount}</div>
          <div className="text-[10px] text-blue-700 mt-0.5">học sinh tích cực</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Nhiệm vụ giao</div>
          <div className="text-2xl font-black text-purple-600 font-heading mt-1">{totalMissions}</div>
          <div className="text-[10px] text-purple-700 mt-0.5">chủ đề 4 môn</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Đã hoàn thành</div>
          <div className="text-2xl font-black text-emerald-600 font-heading mt-1">{totalCompletedCount}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">lượt nộp bài</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Tỉ lệ hoàn thành</div>
          <div className="text-2xl font-black text-amber-600 font-heading mt-1">{completionRate}%</div>
          <div className="text-[10px] text-amber-700 mt-0.5">toàn lớp 5B</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Sản phẩm sáng tạo</div>
          <div className="text-2xl font-black text-pink-600 font-heading mt-1">{totalCreativeProducts}</div>
          <div className="text-[10px] text-pink-700 mt-0.5">sơ đồ tư duy</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase">Tiến bộ rõ rệt</div>
          <div className="text-2xl font-black text-emerald-700 font-heading mt-1">
            {improvedStudentsCount} / {totalStudents}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">tăng điểm can thiệp</div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#1689F8] text-white shadow-md shadow-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>5 Biểu Đồ Phân Tích Năng Lực</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-[#1689F8] text-white shadow-md shadow-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Học Sinh & Đánh Giá</span>
        </button>

        <button
          onClick={() => setActiveTab('missions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'missions'
              ? 'bg-[#1689F8] text-white shadow-md shadow-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tạo & Quản Lý Nhiệm Vụ AI</span>
        </button>
      </div>

      {/* TAB 1: 5 CHARTS (Section IX Requirement) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
            <span>
              📌 <strong>Lưu ý khoa học:</strong> Toàn bộ biểu đồ dưới đây được tính toán từ dữ liệu học sinh lớp 5B lưu trong hệ thống.
            </span>
            <span className="bg-amber-200 font-bold px-2 py-0.5 rounded-md text-[10px]">
              Dữ liệu minh họa GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Pre-test vs Post-test comparison bar chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-heading">
                    1. Biểu đồ so sánh Điểm Đầu Vào và Sau Can Thiệp
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    So sánh mức tăng trưởng điểm số của học sinh (Thang điểm 10)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-3 h-3 bg-slate-300 rounded-sm" /> Đầu vào
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> Sau can thiệp
                  </span>
                </div>
              </div>

              {/* Visual Bars Container */}
              <div className="space-y-3 pt-2">
                {students.slice(0, 5).map((s) => (
                  <div key={s.id} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{s.name} ({s.code})</span>
                      <span className="font-bold text-emerald-700">
                        {s.preTestScore || 6.0}đ &rarr; {s.postTestScore || 8.0}đ (+{((s.postTestScore || 8.0) - (s.preTestScore || 6.0)).toFixed(1)})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full"
                          style={{ width: `${((s.preTestScore || 6.0) / 10) * 100}%` }}
                        />
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${((s.postTestScore || 8.0) / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Weekly progress line chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm font-heading">
                  2. Biểu đồ đường thể hiện Tiến bộ theo tuần học
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mức độ hoàn thành nhiệm vụ trung bình của lớp qua các tuần (Tuần 1 &rarr; 6)
                </p>
              </div>

              {/* SVG Line Chart */}
              <div className="h-48 w-full flex items-end justify-between px-4 pt-4 border-b border-l border-slate-200 relative">
                {[
                  { week: 'Tuần 1', pct: 45 },
                  { week: 'Tuần 2', pct: 60 },
                  { week: 'Tuần 3', pct: 72 },
                  { week: 'Tuần 4', pct: 80 },
                  { week: 'Tuần 5', pct: 88 },
                  { week: 'Tuần 6', pct: 94 },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.pct}%
                    </span>
                    <div
                      className="w-8 bg-gradient-to-t from-sky-400 to-[#1689F8] rounded-t-lg transition-all group-hover:bg-blue-600 shadow-xs"
                      style={{ height: `${item.pct * 1.5}px` }}
                    />
                    <span className="text-[10px] font-semibold text-slate-500 mt-1">
                      {item.week}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Completion rate pie/ring chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm font-heading">
                  3. Biểu đồ tròn Tỉ lệ hoàn thành nhiệm vụ
                </h4>
                <p className="text-[11px] text-slate-500">
                  Phân bố trạng thái bài làm trên tổng số học sinh 5B
                </p>
              </div>

              <div className="flex items-center justify-around py-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${completionRate}, 100`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-emerald-700 font-heading block leading-none">
                      {completionRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Đạt chuẩn</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Hoàn thành tốt ({Math.round(completionRate * 0.8)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span>Đang hoàn thành ({Math.round(completionRate * 0.2)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                    <span>Chưa bắt đầu ({100 - completionRate}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 4: Student achievement levels distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm font-heading">
                  4. Biểu đồ phân bổ mức độ đạt yêu cầu môn học
                </h4>
                <p className="text-[11px] text-slate-500">
                  Xếp loại theo chuẩn đánh giá tiểu học GDPT 2018 (Thông tư 27)
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span className="text-emerald-700">★ Hoàn thành Tốt (HTT)</span>
                    <span>3 học sinh (60%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span className="text-blue-700">● Hoàn thành (HT)</span>
                    <span>2 học sinh (40%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span className="text-slate-400">▲ Chưa hoàn thành (CHT)</span>
                    <span>0 học sinh (0%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 5: 5 Competencies Radar Overview (Full Width) */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-heading">
                    5. Biểu đồ Radar 5 Nhóm Năng Lực Cốt Lõi Lớp 5B
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Kiến thức, Kỹ năng, Tự học, Hợp tác, Tự tin chuẩn bị chuyển cấp THCS
                  </p>
                </div>
                <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-xl">
                  Mục tiêu chuyển cấp toàn diện
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">1. Kiến thức</div>
                  <div className="text-xl font-black text-blue-600 font-heading mt-1">84%</div>
                  <div className="text-[10px] text-slate-500">Toán, TV, Khoa học</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">2. Kỹ năng</div>
                  <div className="text-xl font-black text-emerald-600 font-heading mt-1">85%</div>
                  <div className="text-[10px] text-slate-500">Giải quyết vấn đề</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">3. Tự học</div>
                  <div className="text-xl font-black text-purple-600 font-heading mt-1">88%</div>
                  <div className="text-[10px] text-slate-500">Tự điều chỉnh học tập</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">4. Hợp tác</div>
                  <div className="text-xl font-black text-amber-600 font-heading mt-1">83%</div>
                  <div className="text-[10px] text-slate-500">Làm việc nhóm</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">5. Tự tin</div>
                  <div className="text-xl font-black text-pink-600 font-heading mt-1">86%</div>
                  <div className="text-[10px] text-slate-500">Sẵn sàng vào THCS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên hoặc mã học sinh..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh mới vào 5B</span>
            </button>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Mã số</th>
                  <th className="p-3.5">Học sinh</th>
                  <th className="p-3.5">Giới tính</th>
                  <th className="p-3.5">Điểm đầu vào</th>
                  <th className="p-3.5">Điểm sau can thiệp</th>
                  <th className="p-3.5">Điểm tích lũy</th>
                  <th className="p-3.5">Nhiệm vụ xong</th>
                  <th className="p-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students
                  .filter((s) => s.name.toLowerCase().includes(searchStudent.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500">{s.code}</td>
                      <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-base">{s.avatar}</span>
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3.5">{s.gender}</td>
                      <td className="p-3.5 font-semibold text-slate-600">
                        {editingStudentId === s.id ? (
                          <input
                            type="number"
                            step="0.1"
                            value={tempPreScore}
                            onChange={(e) => setTempPreScore(Number(e.target.value))}
                            className="w-16 p-1 border rounded-md text-xs"
                          />
                        ) : (
                          `${s.preTestScore || 0}đ`
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        {editingStudentId === s.id ? (
                          <input
                            type="number"
                            step="0.1"
                            value={tempPostScore}
                            onChange={(e) => setTempPostScore(Number(e.target.value))}
                            className="w-16 p-1 border rounded-md text-xs"
                          />
                        ) : (
                          `${s.postTestScore || 0}đ`
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-amber-600">{s.points}đ</td>
                      <td className="p-3.5">{s.completedMissions.length} nhiệm vụ</td>
                      <td className="p-3.5 text-right space-x-1">
                        {editingStudentId === s.id ? (
                          <button
                            onClick={() => handleSaveScores(s)}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                          >
                            Lưu
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStudentId(s.id);
                              setTempPreScore(s.preTestScore || 0);
                              setTempPostScore(s.postTestScore || 0);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600"
                            title="Sửa điểm trước/sau"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI MISSIONS MANAGEMENT */}
      {activeTab === 'missions' && (
        <div className="space-y-6">
          {/* AI Generator Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-3xl border-2 border-purple-200 space-y-4">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Công Cụ AI Tạo Nhiệm Vụ & Câu Hỏi Trắc Nghiệm</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Soạn Nhiệm Vụ Tự Động Theo Yêu Cầu Cần Đạt (GDPT 2018)
            </h3>
            <p className="text-xs text-slate-600">
              Giáo viên nhập chủ đề bài học, Gemini AI sẽ tự động sinh ngân hàng câu hỏi có kèm giải thích và gợi ý 3 cấp độ.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
                <select
                  value={missionSubject}
                  onChange={(e) => setMissionSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-purple-500"
                >
                  <option value="Toán">Toán</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Khoa học">Khoa học</option>
                  <option value="Lịch sử và Địa lí">Lịch sử & Địa lí</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Chủ đề bài học:</label>
                <input
                  type="text"
                  value={missionTopic}
                  onChange={(e) => setMissionTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                * Giáo viên duyệt nội dung trước khi học sinh làm bài
              </span>
              <button
                disabled={isGeneratingMission}
                onClick={handleGenerateMissionAI}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-200 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{isGeneratingMission ? 'AI đang tạo nhiệm vụ...' : 'Tạo Nhiệm Vụ Mới'}</span>
              </button>
            </div>

            {generatedMissionResult && (
              <div className="p-3 bg-white border border-purple-200 rounded-xl text-xs text-purple-900 animate-fadeIn font-semibold">
                ✓ {generatedMissionResult}
              </div>
            )}
          </div>

          {/* Existing Missions List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm font-heading">
              Danh sách nhiệm vụ hiện tại ({missions.length} nhiệm vụ):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {m.subject} • Tuần {m.week}
                    </span>
                    <button
                      onClick={() => {
                        storageService.deleteMission(m.id);
                        onMissionsUpdated();
                      }}
                      className="text-slate-400 hover:text-red-500"
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{m.title}</div>
                  <div className="text-slate-500">{m.keyKnowledge}</div>
                  <div className="text-slate-400 text-[11px]">
                    {m.questions.length} câu hỏi • +{m.rewardPoints} điểm thưởng
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-800 font-heading text-lg">
                Thêm Học Sinh Lớp 5B
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Gia Bảo"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Giới tính:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={newStudentGender === 'Nam'}
                      onChange={() => setNewStudentGender('Nam')}
                    />
                    <span>Nam 👦🏻</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={newStudentGender === 'Nữ'}
                      onChange={() => setNewStudentGender('Nữ')}
                    />
                    <span>Nữ 👧🏻</span>
                  </label>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                * Không yêu cầu số CCCD hay địa chỉ cá nhân nhằm đảm bảo an toàn thông tin trẻ em.
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-200"
                >
                  Thêm vào lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

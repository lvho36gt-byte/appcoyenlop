import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Student, Mission, SubjectType, Question } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface Stage2Props {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onBackToMap: () => void;
  onNextStage: () => void;
  soundEnabled: boolean;
}

export const Stage2Missions: React.FC<Stage2Props> = ({
  activeStudent,
  onStudentUpdated,
  onBackToMap: _onBackToMap,
  onNextStage,
  soundEnabled,
}) => {
  const [missions, setMissions] = useState<Mission[]>(() => storageService.getMissions());
  const [filterSubject, setFilterSubject] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Active quiz state within mission
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeHintLevel, setActiveHintLevel] = useState<number | null>(null);

  const filteredMissions = missions.filter((m) => {
    const matchSubject = filterSubject === 'Tất cả' || m.subject === filterSubject;
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.keyKnowledge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleStartMission = (m: Mission) => {
    setSelectedMission(m);
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setActiveHintLevel(null);
  };

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers({ ...userAnswers, [currentQIndex]: optIndex });

    const q = selectedMission?.questions[currentQIndex];
    if (soundEnabled && q) {
      if (optIndex === q.correctIndex) {
        aiService.playCorrectSound();
      } else {
        aiService.playIncorrectSound();
      }
    }
  };

  const handleCompleteMission = () => {
    if (!selectedMission) return;
    setIsSubmitted(true);

    let correctCount = 0;
    selectedMission.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });

    const isAllCorrect = correctCount === selectedMission.questions.length;
    const bonus = isAllCorrect ? selectedMission.rewardPoints + 5 : selectedMission.rewardPoints;

    const { newBadge } = storageService.markMissionComplete(selectedMission.id, bonus);
    onStudentUpdated();

    if (soundEnabled) {
      aiService.playFanfareSound();
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
    setActiveHintLevel(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={_onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          <span>CHẶNG 2: HÀNH TRÌNH TRI THỨC</span>
        </div>
      </div>

      {!selectedMission ? (
        /* Missions List View */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Nhiệm Vụ Học Tập Theo Tuần • Lớp 5B</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 font-heading mt-1">
                Kho Thử Thách Hành Trình Tri Thức
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Các nhiệm vụ bám sát Chương trình GDPT 2018 (Kết nối tri thức). Tự do luyện tập, nhận gợi ý AI và tích lũy điểm thưởng!
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhiệm vụ, chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full sm:w-52 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500"
              >
                <option value="Tất cả">Tất cả môn học</option>
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Lịch sử và Địa lí">Lịch sử & Địa lí</option>
              </select>
            </div>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMissions.map((m) => {
              const isCompleted = activeStudent.completedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all hover:shadow-md flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-100 hover:border-blue-300'
                  }`}
                >
                  <div>
                    {/* Tags */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {m.subject}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Tuần {m.week}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {m.difficulty}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã hoàn thành</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>+{m.rewardPoints}đ</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-800 text-base font-heading mt-2">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      <strong>Kiến thức:</strong> {m.keyKnowledge}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 italic">
                      <strong>Mục tiêu:</strong> {m.learningGoal}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{m.estimatedMinutes} phút • {m.questions.length} câu hỏi</span>
                    </span>

                    <button
                      onClick={() => handleStartMission(m)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                          : 'bg-[#1689F8] text-white hover:bg-blue-600 shadow-md shadow-sky-200'
                      }`}
                    >
                      {isCompleted ? 'Luyện tập lại' : 'Bắt đầu nhiệm vụ'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Mission Quiz View */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-200 relative">
          {/* Mission Top Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedMission.subject} • Tuần {selectedMission.week}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>+{selectedMission.rewardPoints} điểm</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-heading mt-1">
                {selectedMission.title}
              </h2>
            </div>

            <button
              onClick={() => setSelectedMission(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto"
            >
              Đổi nhiệm vụ khác
            </button>
          </div>

          {!isSubmitted ? (
            <div className="mt-6 space-y-6">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">
                  Câu hỏi {currentQIndex + 1} / {selectedMission.questions.length}
                </span>
                <span className="text-slate-400">
                  Hãy suy nghĩ kĩ trước khi bấm nộp bài nhé!
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${((currentQIndex + 1) / selectedMission.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              {selectedMission.questions[currentQIndex] && (
                <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 font-heading">
                    {selectedMission.questions[currentQIndex].question}
                  </h3>
                </div>
              )}

              {/* Options */}
              {selectedMission.questions[currentQIndex] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMission.questions[currentQIndex].options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4 rounded-2xl text-left text-sm font-semibold transition-all border-2 flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3 Step Hint Levels from MapAI when student needs assistance */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="text-base">🤖</span>
                    <span>Hộp Trợ Giúp MapAI (3 Cấp Độ Gợi Ý):</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Không tiết lộ ngay đáp án – Học cách tự giải quyết!
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveHintLevel(1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeHintLevel === 1
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    Gợi ý 1: Nhắc lại quy tắc
                  </button>
                  <button
                    onClick={() => setActiveHintLevel(2)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeHintLevel === 2
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    Gợi ý 2: Ví dụ tương tự
                  </button>
                  <button
                    onClick={() => setActiveHintLevel(3)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeHintLevel === 3
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    Gợi ý 3: Hướng dẫn các bước
                  </button>
                  {activeHintLevel && (
                    <button
                      onClick={() => setActiveHintLevel(null)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Đóng
                    </button>
                  )}
                </div>

                {activeHintLevel && selectedMission.questions[currentQIndex] && (
                  <div className="bg-white p-3.5 rounded-xl border border-sky-100 text-xs text-slate-700 animate-fadeIn">
                    {activeHintLevel === 1 && (
                      <p>
                        💡 <strong>Gợi ý 1 (Quy tắc):</strong> {selectedMission.questions[currentQIndex].hint}
                      </p>
                    )}
                    {activeHintLevel === 2 && (
                      <p>
                        🔍 <strong>Gợi ý 2 (Ví dụ):</strong> Hãy đối chiếu với ví dụ tương tự: Nếu cộng 1/2 và 1/4 thì mẫu số chung là 4. Ta đổi 1/2 = 2/4 rồi tính 2/4 + 1/4 = 3/4.
                      </p>
                    )}
                    {activeHintLevel === 3 && (
                      <p>
                        🚀 <strong>Gợi ý 3 (Các bước thực hiện):</strong> Bước 1: Tìm mẫu số chung. Bước 2: Nhân cả tử và mẫu với thừa số phụ. Bước 3: Thực hiện phép tính tử với tử. Bước 4: Kiểm tra lại kết quả!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => {
                    setCurrentQIndex(currentQIndex - 1);
                    setActiveHintLevel(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                >
                  Câu trước
                </button>

                {currentQIndex < selectedMission.questions.length - 1 ? (
                  <button
                    disabled={userAnswers[currentQIndex] === undefined}
                    onClick={() => {
                      setCurrentQIndex(currentQIndex + 1);
                      setActiveHintLevel(null);
                    }}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 shadow-md shadow-blue-200"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={userAnswers[currentQIndex] === undefined}
                    onClick={handleCompleteMission}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 shadow-md shadow-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Nộp bài & Hoàn thành nhiệm vụ</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Submission Results */
            <div className="mt-6 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl mx-auto shadow-xl">
                🌟
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                  Nhiệm Vụ Đã Hoàn Thành
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
                  Chúc Mừng Em Đã Chinh Phục Thử Thách!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Đã cộng <strong>+{selectedMission.rewardPoints} điểm</strong> vào thẻ tiến bộ của {activeStudent.name}.
                </p>
              </div>

              {/* Answers Review */}
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="text-xs font-bold text-slate-700 uppercase">
                  Xem lại lời giải chi tiết:
                </div>
                {selectedMission.questions.map((q, idx) => {
                  const isCorrect = userAnswers[idx] === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-800">
                          Câu {idx + 1}: {q.question}
                        </span>
                        <span className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                          {isCorrect ? '✓ Đúng' : '✗ Chưa đúng'}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        <strong>Đáp án đúng:</strong> {q.options[q.correctIndex]}
                      </div>
                      <div className="text-slate-700 bg-white/70 p-2 rounded-xl">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại nhiệm vụ này</span>
                </button>

                <button
                  onClick={() => setSelectedMission(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
                >
                  Chọn nhiệm vụ khác
                </button>

                <button
                  onClick={onNextStage}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200"
                >
                  <span>Chuyển sang Chặng 3: MapAI Bạn Học Tập</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  Smile,
  Heart,
  Send,
  Sparkles,
  Award,
  Star,
  ChevronLeft,
  Calendar,
  BookOpen,
  TrendingUp,
  Printer,
  CheckCircle,
} from 'lucide-react';
import { Student, ReflectionEntry } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface Stage5Props {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onBackToMap: () => void;
  onOpenProgressCard: () => void;
  soundEnabled: boolean;
}

export const Stage5ProgressDiary: React.FC<Stage5Props> = ({
  activeStudent,
  onStudentUpdated,
  onBackToMap: _onBackToMap,
  onOpenProgressCard,
  soundEnabled,
}) => {
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() =>
    storageService.getReflections()
  );

  const [learned, setLearned] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tomorrowGoal, setTomorrowGoal] = useState('');
  const [selectedMood, setSelectedMood] = useState<'😊' | '😄' | '🤔' | '💪'>('😄');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestAIFeedback, setLatestAIFeedback] = useState<string | null>(null);

  const moodOptions: { emoji: '😊' | '😄' | '🤔' | '💪'; label: string; desc: string }[] = [
    { emoji: '😊', label: 'Vui vẻ', desc: 'Hôm nay việc học thật nhiều niềm vui' },
    { emoji: '😄', label: 'Tự tin', desc: 'Em đã hiểu bài và làm tốt các thử thách' },
    { emoji: '🤔', label: 'Cần luyện tập', desc: 'Còn một vài chỗ em cần hỏi thêm MapAI' },
    { emoji: '💪', label: 'Sẵn sàng', desc: 'Tràn đầy năng lượng cho mục tiêu mới' },
  ];

  const handleSubmitDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learned.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const feedback = await aiService.getReflectionFeedback({
        learned,
        difficulty: difficulty || 'Không có khó khăn lớn',
        tomorrowGoal: tomorrowGoal || 'Tiếp tục chăm chỉ học tập',
        mood: selectedMood,
        studentName: activeStudent.name,
      });

      const entry: ReflectionEntry = {
        id: `ref-${Date.now()}`,
        studentId: activeStudent.id,
        date: new Date().toISOString().split('T')[0],
        learned,
        difficulty,
        tomorrowGoal,
        mood: selectedMood,
        aiFeedback: feedback,
      };

      storageService.addReflection(entry);
      setReflections(storageService.getReflections());
      setLatestAIFeedback(feedback);
      onStudentUpdated();

      // Clear form
      setLearned('');
      setDifficulty('');
      setTomorrowGoal('');

      if (soundEnabled) aiService.playFanfareSound();
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={_onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pink-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full border border-pink-200">
          <span>CHẶNG 5: HÀNH TRÌNH TRƯỞNG THÀNH</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Reflection Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-pink-200 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
              <Smile className="w-4 h-4" />
              <span>Nhật Ký Tự Đánh Giá & Tiến Bộ Hằng Ngày</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-heading mt-1">
              Ghi Lại Mỗi Bước Chân Tiến Bộ
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Viết nhật ký giúp em rèn luyện kỹ năng tự điều chỉnh học tập, nhận lời động viên chân thành từ MapAI (+5 điểm).
            </p>
          </div>

          <form onSubmit={handleSubmitDiary} className="space-y-4 text-xs">
            {/* Mood selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-2">
                Hôm nay tâm trạng học tập của em thế nào?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {moodOptions.map((m) => (
                  <button
                    key={m.emoji}
                    type="button"
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                      selectedMood === m.emoji
                        ? 'border-pink-500 bg-pink-50/80 shadow-xs scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-pink-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <div className="font-bold text-slate-800 text-[11px]">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 1 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                1. Hôm nay em đã học được điều gì mới hoặc giải được bài toán nào?
              </label>
              <textarea
                rows={2}
                required
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="Ví dụ: Em đã biết cách quy đồng mẫu số và nhớ được 5 cặp từ đồng nghĩa..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-pink-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                2. Em gặp khó khăn ở nội dung nào và đã nhờ ai hỗ trợ?
              </label>
              <textarea
                rows={2}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Ví dụ: Lúc đầu em nhầm lẫn giữa mét và kilômét, sau đó được MapAI gợi ý cách đổi..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-pink-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Question 3 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                3. Ngày mai em muốn cố gắng hoàn thành mục tiêu gì?
              </label>
              <textarea
                rows={2}
                value={tomorrowGoal}
                onChange={(e) => setTomorrowGoal(e.target.value)}
                placeholder="Ví dụ: Sẽ làm bài trắc nghiệm Lịch sử và hoàn thành sơ đồ tư duy..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-pink-500 focus:bg-white leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!learned.trim() || isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-200 disabled:opacity-40 transition-all text-xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi nhật ký đến MapAI...' : 'Lưu Nhật Ký & Nhận Lời Khen (+5đ)'}</span>
            </button>
          </form>

          {/* Real-time AI Feedback Box */}
          {latestAIFeedback && (
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 text-xs text-pink-950 animate-fadeIn space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-pink-900">
                <span className="text-xl">🤖</span>
                <span>Lời Nhận Xét & Động Viên Từ MapAI:</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line pl-7">
                “{latestAIFeedback}”
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Personal Growth Stats & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm font-heading">
                Hồ Sơ Nỗ Lực Cá Nhân
              </span>
              <button
                onClick={onOpenProgressCard}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1"
              >
                <span>Xuất Thẻ Tiến Bộ</span>
                <Printer className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="text-2xl font-black text-amber-700 font-heading">
                  {activeStudent.points}
                </div>
                <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                  Điểm tích lũy
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                <div className="text-2xl font-black text-blue-700 font-heading">
                  {activeStudent.completedMissions.length}
                </div>
                <div className="text-[11px] text-blue-800 font-semibold mt-0.5">
                  Nhiệm vụ xong
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="text-2xl font-black text-emerald-700 font-heading">
                  {activeStudent.badges.length} / 8
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                  Huy hiệu đạt được
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <div className="text-2xl font-black text-purple-700 font-heading">
                  +{((activeStudent.postTestScore || 8.5) - (activeStudent.preTestScore || 6.5)).toFixed(1)}
                </div>
                <div className="text-[11px] text-purple-800 font-semibold mt-0.5">
                  Mức tăng tiến bộ
                </div>
              </div>
            </div>

            {/* Radar-like Competencies Bars */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="font-bold text-slate-700">5 Nhóm năng lực phát triển:</div>

              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Kiến thức cốt lõi</span>
                    <span className="font-bold">{activeStudent.competencies.knowledge}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${activeStudent.competencies.knowledge}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Kỹ năng giải quyết vấn đề</span>
                    <span className="font-bold">{activeStudent.competencies.skills}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${activeStudent.competencies.skills}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Năng lực tự học & tự chủ</span>
                    <span className="font-bold">{activeStudent.competencies.selfStudy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${activeStudent.competencies.selfStudy}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Kỹ năng hợp tác nhóm</span>
                    <span className="font-bold">{activeStudent.competencies.collaboration}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${activeStudent.competencies.collaboration}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Tự tin sẵn sàng vào THCS</span>
                    <span className="font-bold">{activeStudent.competencies.confidence}%</span>
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
          </div>

          {/* Past reflections list */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-heading">
              Nhật Ký Các Ngày Trước:
            </h4>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {reflections.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1 font-bold text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>{r.date}</span>
                    </span>
                    <span className="text-base">{r.mood}</span>
                  </div>
                  <p className="text-slate-700">
                    <strong>Đã học:</strong> {r.learned}
                  </p>
                  {r.aiFeedback && (
                    <p className="text-pink-700 italic bg-pink-50/60 p-2 rounded-xl text-[11px]">
                      🤖 {r.aiFeedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

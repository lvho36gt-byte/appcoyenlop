import React, { useState } from 'react';
import { CheckCircle, Sparkles, X, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { Student } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface MissionCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: Student;
  onStudentUpdated: () => void;
  soundEnabled: boolean;
}

const CHECKIN_QUESTIONS = [
  {
    q: 'Hôm nay em đã sẵn sàng năng lượng bước vào hành trình chinh phục lớp 5 chưa?',
    options: ['A. Rất sẵn sàng và hào hứng! 🚀', 'B. Hơi mệt nhưng sẽ cố gắng 💪', 'C. Sẵn sàng cùng các bạn 🌱'],
    correct: 0,
    point: 5,
  },
  {
    q: 'Quy đồng mẫu số của 1/2 và 1/3, mẫu số chung nhỏ nhất là bao nhiêu?',
    options: ['A. 5', 'B. 6', 'C. 12', 'D. 8'],
    correct: 1,
    point: 5,
  },
  {
    q: 'Mục tiêu quan trọng nhất trong buổi học hôm nay của em là gì?',
    options: ['A. Hoàn thành ít nhất 1 nhiệm vụ và viết nhật ký tiến bộ', 'B. Nhận thêm một huy hiệu mới', 'C. Giúp đỡ một bạn cùng nhóm'],
    correct: 0,
    point: 5,
  },
];

export const MissionCheckInModal: React.FC<MissionCheckInModalProps> = ({
  isOpen,
  onClose,
  activeStudent,
  onStudentUpdated,
  soundEnabled,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentQ = CHECKIN_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: idx });
    if (soundEnabled) aiService.playCorrectSound();
  };

  const handleNext = () => {
    if (currentIdx < CHECKIN_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsDone(true);
      storageService.addPointsToActiveStudent(15);
      onStudentUpdated();
      if (soundEnabled) aiService.playFanfareSound();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsDone(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col border-2 border-orange-200">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-black font-heading leading-tight">
                MISSION CHECK-IN: KHỞI ĐỘNG ĐẦU BUỔI
              </h3>
              <p className="text-xs text-orange-100">
                3 câu hỏi đánh thức tư duy, chuẩn bị mục tiêu hôm nay
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

        <div className="p-6 text-xs text-slate-700 space-y-5">
          {!isDone ? (
            <>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Câu {currentIdx + 1} / 3</span>
                <span className="text-orange-600">+5 điểm mỗi câu</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${((currentIdx + 1) / 3) * 100}%` }}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-sm font-bold text-slate-800 font-heading">
                {currentQ.q}
              </div>

              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  const isSel = selectedAnswers[currentIdx] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left font-semibold transition-all flex items-center justify-between ${
                        isSel
                          ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-orange-200 text-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSel && <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={selectedAnswers[currentIdx] === undefined}
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold flex items-center gap-1.5 shadow-md shadow-orange-200 transition-all"
                >
                  <span>{currentIdx < 2 ? 'Tiếp theo' : 'Hoàn thành khởi động'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-3">
              <div className="text-5xl">🎉</div>
              <h4 className="text-xl font-black font-heading text-slate-800">
                Khởi Động Thành Công!
              </h4>
              <p className="text-slate-600 text-xs">
                Chúc <span className="font-bold text-orange-600">{activeStudent.name}</span> một buổi học tràn đầy năng lượng và khám phá thêm nhiều điều bổ ích! (+15 điểm tích lũy)
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#1689F8] text-white font-bold hover:bg-blue-600 shadow-md shadow-sky-200"
                >
                  Bắt đầu nhiệm vụ ngay! 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

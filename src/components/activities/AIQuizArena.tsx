import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  Volume2,
} from 'lucide-react';
import { Question, SubjectType } from '../../types';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';

interface AIQuizArenaProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onStudentUpdated: () => void;
}

const PRESET_QUIZ: Question[] = [
  {
    id: 'q-arena-1',
    question: 'Tính: 3/4 + 1/8 bằng bao nhiêu?',
    options: ['A. 5/8', 'B. 7/8', 'C. 1', 'D. 3/8'],
    correctIndex: 1,
    explanation: 'Quy đồng 3/4 = 6/8. Sau đó 6/8 + 1/8 = 7/8.',
    hint: 'Tìm mẫu số chung là 8 trước khi cộng hai phân số.',
    subject: 'Toán',
  },
  {
    id: 'q-arena-2',
    question: 'Cặp từ nào dưới đây là từ đồng nghĩa?',
    options: ['A. Cần cù - Siêng năng', 'B. Trắng - Đen', 'C. Dài - Ngắn', 'D. Thông minh - Lười biếng'],
    correctIndex: 0,
    explanation: '"Cần cù" và "siêng năng" đều chỉ sự chịu khó, chuyên cần trong học tập và lao động.',
    hint: 'Từ đồng nghĩa là các từ có nghĩa giống nhau hoặc rất gần nhau.',
    subject: 'Tiếng Việt',
  },
  {
    id: 'q-arena-3',
    question: 'Nguồn năng lượng nào sau đây là năng lượng tái tạo sạch?',
    options: ['A. Than đá', 'B. Năng lượng gió và ánh sáng mặt trời', 'C. Dầu mỏ', 'D. Khí đốt tự nhiên'],
    correctIndex: 1,
    explanation: 'Gió và ánh sáng mặt trời là nguồn năng lượng tái tạo vô tận và thân thiện với môi trường.',
    hint: 'Năng lượng tự nhiên không bao giờ cạn kiệt và không thải khói bụi.',
    subject: 'Khoa học',
  },
  {
    id: 'q-arena-4',
    question: 'Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình vào ngày tháng năm nào?',
    options: ['A. 19/8/1945', 'B. 2/9/1945', 'C. 7/5/1954', 'D. 30/4/1975'],
    correctIndex: 1,
    explanation: 'Ngày 2/9/1945, Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    hint: 'Đây chính là ngày Quốc khánh của nước Việt Nam ta.',
    subject: 'Lịch sử và Địa lí',
  },
];

export const AIQuizArena: React.FC<AIQuizArenaProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onStudentUpdated,
}) => {
  const [questions, setQuestions] = useState<Question[]>(PRESET_QUIZ);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isGameOver || !timerActive || isAnswered) return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, timerActive, isAnswered, isGameOver]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleTimeOut = () => {
    setIsAnswered(true);
    if (soundEnabled) aiService.playIncorrectSound();
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      if (soundEnabled) aiService.playCorrectSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      if (soundEnabled) aiService.playIncorrectSound();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setShowHint(false);
    } else {
      // Game Over
      setIsGameOver(true);
      storageService.addPointsToActiveStudent(score);
      onStudentUpdated();
      if (soundEnabled) aiService.playFanfareSound();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(20);
    setIsGameOver(false);
    setShowHint(false);
  };

  const handleGenerateAIQuiz = async () => {
    setIsGeneratingNew(true);
    try {
      const res = await aiService.generateQuiz('Toán', 'Số thập phân và phân số', 'Thông hiểu', 4);
      if (res.questions && res.questions.length > 0) {
        setQuestions(
          res.questions.map((q, i) => ({
            id: `gen-${i}`,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            hint: q.hint,
          }))
        );
        handleRestart();
      }
    } catch {
    } finally {
      setIsGeneratingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border-2 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-black font-heading leading-tight flex items-center gap-2">
                <span>AI QUIZ – ĐẤU TRƯỜNG TRI THỨC</span>
                <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-bold">
                  Lớp 5B
                </span>
              </h3>
              <p className="text-xs text-amber-100">
                Thử thách kiến thức nhanh, tính giờ và nhận pháo hoa sao vàng!
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

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {!isGameOver ? (
            <>
              {/* Status bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-amber-800">
                    Câu hỏi {currentIdx + 1} / {questions.length}
                  </span>
                  {currentQ.subject && (
                    <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-[10px]">
                      {currentQ.subject}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Timer */}
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{score} điểm</span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-base sm:text-lg font-bold font-heading text-slate-800 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle =
                    'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border-2 flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Hint Box */}
              {isAnswered && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs space-y-1 text-sky-950 animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-sky-900">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Lời giải chi tiết:</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {/* Bottom controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý phương pháp'}</span>
                </button>

                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-200 transition-all"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {showHint && (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-xs text-yellow-900 animate-fadeIn">
                  💡 <strong>Gợi ý:</strong> {currentQ.hint}
                </div>
              )}
            </>
          ) : (
            /* Game Over View */
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl mx-auto shadow-xl">
                🏆
              </div>

              <div>
                <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                  Hoàn Thành Đấu Trường Tri Thức
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 mt-1">
                  Xuất Sắc! Bạn Đạt {score} Điểm
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Điểm số đã được ghi nhận vào tài khoản học sinh. Tiếp tục giữ vững phong độ nhé!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại vòng này</span>
                </button>

                <button
                  disabled={isGeneratingNew}
                  onClick={handleGenerateAIQuiz}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{isGeneratingNew ? 'AI đang tạo câu hỏi mới...' : 'AI sinh bộ câu hỏi mới'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200"
                >
                  Hoàn thành & Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

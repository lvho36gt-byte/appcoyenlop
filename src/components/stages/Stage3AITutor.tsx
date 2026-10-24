import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import { Student } from '../../types';
import { aiService } from '../../services/aiService';

interface Stage3Props {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onBackToMap: () => void;
  onNextStage: () => void;
  soundEnabled: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mapai';
  text: string;
  hintLevel?: number;
  timestamp: string;
}

export const Stage3AITutor: React.FC<Stage3Props> = ({
  activeStudent,
  onStudentUpdated: _onStudentUpdated,
  onBackToMap: _onBackToMap,
  onNextStage,
  soundEnabled: _soundEnabled,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'mapai',
      text: `Xin chào ${activeStudent.name}! Mình là MapAI - người bạn đồng hành của bạn. Hôm nay bạn đang gặp khó khăn ở bài học nào? Hãy hỏi mình nhé! Nhớ là mình sẽ gợi ý từng bước chứ không cho ngay đáp án đâu đấy! 😊`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(1);
  const [readingMsgId, setReadingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickQuestions = [
    'MapAI ơi, mình chưa biết cộng hai phân số khác mẫu số!',
    'Làm thế nào để phân biệt từ đồng nghĩa và từ trái nghĩa?',
    'Vì sao năng lượng mặt trời lại là năng lượng sạch?',
    'Ý nghĩa ngày Bác Hồ đọc Tuyên ngôn Độc lập 2/9/1945?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiService.askTutor(text, activeHintLevel);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'mapai',
        text: response.reply,
        hintLevel: activeHintLevel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'mapai',
        text: 'MapAI luôn đồng hành cùng bạn! Hãy đọc kĩ sách giáo khoa và suy nghĩ theo các bước nhé! 🌟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (readingMsgId === msgId) {
      aiService.stopSpeaking();
      setReadingMsgId(null);
    } else {
      setReadingMsgId(msgId);
      aiService.speakVietnamese(text);
      // Auto reset reading state after estimated duration
      setTimeout(() => {
        setReadingMsgId(null);
      }, Math.max(3000, text.length * 70));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={_onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <span>CHẶNG 3: TRẠM HỖ TRỢ THÔNG MINH</span>
        </div>
      </div>

      {/* Main Tutor Chat Box */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 overflow-hidden flex flex-col h-[700px]">
        {/* Chat Top Banner */}
        <div className="bg-gradient-to-r from-[#22C55E] to-emerald-600 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner border border-white/30 animate-float">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl font-heading leading-tight">
                  MapAI – Gia Sư Lớp 5 Thông Minh
                </h3>
                <span className="bg-emerald-800/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Đồng hành tự học • 3 cấp độ gợi ý sư phạm • Lọc nội dung an toàn
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>GDPT 2018</span>
          </div>
        </div>

        {/* 3 Hint Level selector bar */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-900 hidden sm:inline">
            Chọn cấp độ gợi ý mong muốn:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setActiveHintLevel(1)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                activeHintLevel === 1
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Cấp 1: Nhắc quy tắc
            </button>
            <button
              onClick={() => setActiveHintLevel(2)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                activeHintLevel === 2
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-800 hover:bg-blue-100'
              }`}
            >
              Cấp 2: Ví dụ tương tự
            </button>
            <button
              onClick={() => setActiveHintLevel(3)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                activeHintLevel === 3
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-purple-800 hover:bg-purple-100'
              }`}
            >
              Cấp 3: Bước giải
            </button>
          </div>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((m) => {
            const isAI = m.sender === 'mapai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isAI ? 'self-start' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-sm font-bold ${
                    isAI ? 'bg-emerald-500 text-white' : 'bg-[#1689F8] text-white'
                  }`}
                >
                  {isAI ? '🤖' : activeStudent.avatar}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      : 'bg-[#1689F8] text-white rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Audio read button & timestamp */}
                  <div
                    className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                      isAI
                        ? 'border-slate-100 text-slate-400'
                        : 'border-white/20 text-white/80'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => handleToggleSpeak(m.id, m.text)}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                      >
                        {readingMsgId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500" />
                            <span>Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe đọc 🔊</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm shadow-xs">
                🤖
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>MapAI đang suy nghĩ gợi ý cho bạn...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Gợi ý hỏi:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 px-3 py-1 rounded-full shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi hoặc kiến thức em chưa hiểu..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-[#22C55E] hover:bg-emerald-600 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Stage Transition */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNextStage}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9254DE] hover:bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all"
        >
          <span>Khám phá Chặng 4: Xưởng Sáng Tạo AI</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

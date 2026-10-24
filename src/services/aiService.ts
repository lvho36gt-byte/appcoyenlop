export interface TutorResponse {
  reply: string;
  isOfflineFallback: boolean;
}

export interface QuizQuestionResponse {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export const aiService = {
  // Tutor Chat
  async askTutor(message: string, hintLevel?: number, context?: string): Promise<TutorResponse> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, hintLevel, context }),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return {
        reply: 'MapAI luôn đồng hành cùng bạn! Hãy đọc kĩ yêu cầu bài toán và thử vận dụng công thức đã học nhé! 🌟',
        isOfflineFallback: true,
      };
    }
  },

  // AI Quiz Generator
  async generateQuiz(subject: string, topic: string, level: string, count = 3): Promise<{ questions: QuizQuestionResponse[]; isOfflineFallback: boolean }> {
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, level, count }),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return {
        questions: [
          {
            id: 'fallback-1',
            question: `Câu hỏi ôn tập môn ${subject}: ${topic}`,
            options: ['A. Phương án 1', 'B. Phương án 2 (Đúng)', 'C. Phương án 3', 'D. Phương án 4'],
            correctIndex: 1,
            explanation: 'Đây là câu hỏi mẫu từ ngân hàng dữ liệu GDPT 2018.',
            hint: 'Nhớ lại định lý và quy tắc đã học ở bài này nhé!',
          },
        ],
        isOfflineFallback: true,
      };
    }
  },

  // Suggest Mind Map
  async suggestMindMap(topic: string, subject = 'Khoa học') {
    try {
      const res = await fetch('/api/ai/suggest-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject }),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return {
        mindmap: {
          central: topic || 'Chủ đề học tập',
          color: '#1689F8',
          branches: [
            { id: 'b1', title: 'Khái niệm cốt lõi', color: '#22C55E', children: ['Định nghĩa', 'Đặc điểm'] },
            { id: 'b2', title: 'Ứng dụng thực tiễn', color: '#FF9635', children: ['Trong học tập', 'Trong cuộc sống'] },
            { id: 'b3', title: 'Lưu ý cần nhớ', color: '#9254DE', children: ['Quy tắc vàng', 'Ví dụ điển hình'] },
          ],
        },
        isOfflineFallback: true,
      };
    }
  },

  // Reflection Feedback
  async getReflectionFeedback(data: { learned: string; difficulty: string; tomorrowGoal: string; mood: string; studentName: string }): Promise<string> {
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      return json.feedback;
    } catch {
      return `MapAI rất tự hào về nỗ lực hôm nay của ${data.studentName}! Hãy giữ vững tinh thần tự học nhé! ⭐`;
    }
  },

  // Text to Speech (Vietnamese)
  speakVietnamese(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Friendly, clear speed for elementary students
    utterance.pitch = 1.05; // Slightly cheerful pitch

    // Find Vietnamese voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // Audio Effects via Web Audio API (Zero external network lag)
  playCorrectSound() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext not allowed or unsupported
    }
  },

  playIncorrectSound() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, ctx.currentTime + 0.25); // E3
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext error ignored
    }
  },

  playFanfareSound() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
      });
    } catch {
      // AudioContext error ignored
    }
  },
};

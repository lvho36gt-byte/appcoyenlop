import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  BookOpen,
} from 'lucide-react';
import { Student, SubjectType, CognitiveLevel, Question } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface Stage1Props {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onBackToMap: () => void;
  onNextStage: () => void;
  soundEnabled: boolean;
}

const DIAGNOSTIC_QUESTIONS: Record<SubjectType, Question[]> = {
  Toán: [
    {
      id: 'd-t1',
      question: 'Phân số 3/5 bằng phân số nào dưới đây?',
      options: ['A. 6/10', 'B. 5/3', 'C. 9/12', 'D. 3/10'],
      correctIndex: 0,
      explanation: 'Nhân cả tử số và mẫu số của 3/5 với 2 ta được 6/10.',
      hint: 'Tính chất cơ bản: Nhân cả tử và mẫu với cùng một số tự nhiên khác 0.',
      level: 'Nhận biết',
    },
    {
      id: 'd-t2',
      question: 'Kết quả của phép tính: 2/3 + 1/6 là:',
      options: ['A. 3/9', 'B. 5/6', 'C. 1/2', 'D. 3/6'],
      correctIndex: 1,
      explanation: 'Quy đồng 2/3 = 4/6. Sau đó: 4/6 + 1/6 = 5/6.',
      hint: 'Quy đồng mẫu số chung là 6 trước khi cộng hai phân số.',
      level: 'Thông hiểu',
    },
    {
      id: 'd-t3',
      question: 'Một mảnh đất hình chữ nhật có nửa chu vi là 36m, chiều rộng bằng 4/5 chiều dài. Diện tích mảnh đất là:',
      options: ['A. 320 m²', 'B. 360 m²', 'C. 400 m²', 'D. 280 m²'],
      correctIndex: 0,
      explanation: 'Tổng số phần bằng nhau: 4 + 5 = 9. Chiều dài: 36 ÷ 9 × 5 = 20m. Chiều rộng: 36 - 20 = 16m. Diện tích: 20 × 16 = 320 m².',
      hint: 'Đây là bài toán tìm hai số khi biết tổng và tỉ số của hai số đó.',
      level: 'Vận dụng',
    },
    {
      id: 'd-t4',
      question: 'Một canô đi xuôi dòng từ bến A đến bến B mất 2 giờ, đi ngược dòng từ B về A mất 3 giờ. Vận tốc dòng nước là 3 km/giờ. Khoảng cách AB là:',
      options: ['A. 30 km', 'B. 36 km', 'C. 45 km', 'D. 40 km'],
      correctIndex: 1,
      explanation: 'Vận tốc xuôi trừ vận tốc ngược bằng 2 lần vận tốc dòng nước (6 km/h). Tỉ số thời gian xuôi/ngược là 2/3 nên tỉ số vận tốc là 3/2. Vận tốc xuôi là 6 × 3 = 18 km/h. Quãng đường AB = 18 × 2 = 36 km.',
      hint: 'Chú ý mối liên hệ giữa thời gian và vận tốc trong chuyển động trên dòng nước.',
      level: 'Vận dụng cao',
    },
  ],
  'Tiếng Việt': [
    {
      id: 'd-tv1',
      question: 'Từ nào sau đây viết ĐÚNG chính tả?',
      options: ['A. Sắp xếp', 'B. Xắp xếp', 'C. Sắp sếp', 'D. Xắp sếp'],
      correctIndex: 0,
      explanation: '"Sắp xếp" viết đúng theo quy tắc chính tả tiếng Việt.',
      hint: 'Chú ý phụ âm đầu s và x.',
      level: 'Nhận biết',
    },
    {
      id: 'd-tv2',
      question: 'Xác định từ đồng nghĩa với từ "bao la" trong câu "Cánh đồng lúa rộng bao la":',
      options: ['A. Bát ngát', 'B. Nhỏ bé', 'C. Chật hẹp', 'D. Cao vút'],
      correctIndex: 0,
      explanation: '"Bao la" và "bát ngát" đều diễn tả không gian rộng lớn đến vô tận.',
      hint: 'Tìm từ miêu tả độ rộng lớn của cảnh vật.',
      level: 'Thông hiểu',
    },
    {
      id: 'd-tv3',
      question: 'Xác định chủ ngữ trong câu: "Dưới bóng tre xanh của làng quê Việt Nam, người nông dân dựng nhà, cày cấy."',
      options: ['A. Dưới bóng tre xanh', 'B. người nông dân', 'C. làng quê Việt Nam', 'D. người nông dân dựng nhà'],
      correctIndex: 1,
      explanation: 'Bộ phận "Dưới bóng tre xanh của làng quê Việt Nam" là trạng ngữ; "người nông dân" là chủ ngữ; "dựng nhà, cày cấy" là vị ngữ.',
      hint: 'Ai là người thực hiện hành động dựng nhà, cày cấy?',
      level: 'Vận dụng',
    },
    {
      id: 'd-tv4',
      question: 'Trong câu văn "Mặt trời như một quả cầu lửa khổng lồ từ từ nhô lên khỏi mặt biển", hình ảnh so sánh làm tăng hiệu quả nghệ thuật như thế nào?',
      options: ['A. Giúp hình dung rõ nét vẻ đẹp rực rỡ, hùng vĩ của bình minh trên biển', 'B. Nhấn mạnh cái nóng gay gắt của thời tiết', 'C. Miêu tả kích thước chính xác của thiên thể', 'D. Làm câu văn ngắn gọn hơn'],
      correctIndex: 0,
      explanation: 'Phép so sánh nhân đôi ấn tượng thị giác, gợi sự ấm áp, kì vĩ của ngày mới.',
      hint: 'Nghĩ về cảm xúc của người đọc khi chiêm ngưỡng cảnh bình minh.',
      level: 'Vận dụng cao',
    },
  ],
  'Khoa học': [
    {
      id: 'd-kh1',
      question: 'Vật nào dưới đây là vật tự phát sáng?',
      options: ['A. Mặt Trăng', 'B. Mặt Trời', 'C. Gương soi', 'D. Tấm kim loại'],
      correctIndex: 1,
      explanation: 'Mặt Trời là ngôi sao tự phát ra ánh sáng và nhiệt, Mặt Trăng chỉ phản chiếu ánh sáng Mặt Trời.',
      hint: 'Vật tự nó sinh ra ánh sáng mà không cần nguồn khác chiếu vào.',
      level: 'Nhận biết',
    },
    {
      id: 'd-kh2',
      question: 'Hiện tượng nước chuyển từ thể lỏng sang thể khí (hơi) gọi là:',
      options: ['A. Nóng chảy', 'B. Bay hơi', 'C. Đông đặc', 'D. Ngưng tụ'],
      correctIndex: 1,
      explanation: 'Quá trình nước lỏng biến thành hơi nước khi được đun nóng hoặc ở nhiệt độ môi trường là sự bay hơi.',
      hint: 'Ví dụ như khi phơi quần áo ướt dưới nắng.',
      level: 'Thông hiểu',
    },
    {
      id: 'd-kh3',
      question: 'Để trồng rau xanh tươi tốt và an toàn cho sức khỏe, biện pháp nào sau đây là TỐT NHẤT?',
      options: ['A. Phun thuốc trừ sâu hóa học liên tục mỗi ngày', 'B. Bón phân hữu cơ ủ hoai và bắt sâu bằng tay', 'C. Dùng nước cống ô nhiễm để tưới', 'D. Không cần ánh sáng mặt trời'],
      correctIndex: 1,
      explanation: 'Phân hữu cơ và biện pháp thủ công bảo vệ môi trường và bảo đảm an toàn thực phẩm.',
      hint: 'Lựa chọn phương pháp canh tác xanh, bền vững.',
      level: 'Vận dụng',
    },
    {
      id: 'd-kh4',
      question: 'Tại sao việc phát triển năng lượng gió và năng lượng mặt trời lại đóng vai trò quyết định trong việc giảm hiệu ứng nhà kính toàn cầu?',
      options: ['A. Vì chúng không thải ra khí cacbonic (CO2) khi vận hành tạo ra điện', 'B. Vì chúng làm cho nhiệt độ Trái Đất lạnh đi tức thì', 'C. Vì giá thành sản xuất luôn bằng không', 'D. Vì chúng không chiếm diện tích đất đai'],
      correctIndex: 0,
      explanation: 'Điện gió và điện mặt trời thay thế nhà máy nhiệt điện than, giảm phát thải khí nhà kính.',
      hint: 'Khí CO2 từ nhiên liệu hóa thạch là nguyên nhân chính gây nóng lên toàn cầu.',
      level: 'Vận dụng cao',
    },
  ],
  'Lịch sử và Địa lí': [
    {
      id: 'd-ls1',
      question: 'Địa hình nước ta có đặc điểm nào nổi bật?',
      options: ['A. 3/4 diện tích là đồi núi, 1/4 diện tích là đồng bằng', 'B. Toàn bộ là hoang mạc', 'C. 1/2 diện tích là băng tuyết', 'D. Không có bờ biển'],
      correctIndex: 0,
      explanation: 'Đồi núi chiếm 3/4 diện tích lãnh thổ đất liền nước ta, đồng bằng chiếm 1/4.',
      hint: 'Nước ta nhiều núi cao, đồi dốc kéo dài từ Bắc vào Nam.',
      level: 'Nhận biết',
    },
    {
      id: 'd-ls2',
      question: 'Vì sao đồng bằng sông Cửu Long lại là vựa lúa lớn nhất của cả nước?',
      options: ['A. Đất phù sa màu mỡ và nguồn nước dồi dào quanh năm', 'B. Khí hậu lạnh giá quanh năm', 'C. Ít có sông ngòi kênh rạch', 'D. Nằm ở vùng núi cao phía Bắc'],
      correctIndex: 0,
      explanation: 'Phù sa sông Mê Kông bồi đắp cùng khí hậu cận xích đạo nóng ẩm tạo điều kiện lý tưởng cho cây lúa nước.',
      hint: 'Đặc điểm đất đai màu mỡ và mạng lưới sông rạch.',
      level: 'Thông hiểu',
    },
    {
      id: 'd-ls3',
      question: 'Chiến dịch Điện Biên Phủ năm 1954 diễn ra trong bao nhiêu ngày đêm?',
      options: ['A. 56 ngày đêm', 'B. 30 ngày đêm', 'C. 12 ngày đêm', 'D. 100 ngày đêm'],
      correctIndex: 0,
      explanation: 'Chiến dịch kéo dài 56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt", toàn thắng ngày 7/5/1954.',
      hint: '56 ngày đêm hào hùng của quân và dân ta.',
      level: 'Vận dụng',
    },
    {
      id: 'd-ls4',
      question: 'Bài học lịch sử lớn nhất rút ra từ thắng lợi của Cách mạng Tháng Tám năm 1945 là gì?',
      options: ['A. Sức mạnh đại đoàn kết toàn dân tộc dưới sự lãnh đạo đúng đắn của Đảng', 'B. Dựa hoàn toàn vào sự giúp đỡ từ nước ngoài', 'C. Chỉ cần một nhóm nhỏ vũ trang', 'D. Chờ đợi thời cơ tự nhiên đến'],
      correctIndex: 0,
      explanation: 'Sự đoàn kết muôn triệu người con đất Việt triệu người như một đã làm nên cuộc cách mạng vĩ đại.',
      hint: 'Sức mạnh tập thể của toàn thể nhân dân Việt Nam.',
      level: 'Vận dụng cao',
    },
  ],
  'Tiếng Anh': [],
};

export const Stage1Diagnostic: React.FC<Stage1Props> = ({
  activeStudent,
  onStudentUpdated,
  onBackToMap: _onBackToMap,
  onNextStage,
  soundEnabled,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Toán');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const questions = DIAGNOSTIC_QUESTIONS[selectedSubject] || DIAGNOSTIC_QUESTIONS['Toán'];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: idx });
    if (soundEnabled) {
      if (idx === currentQ.correctIndex) {
        aiService.playCorrectSound();
      }
    }
  };

  const handleFinish = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correctCount++;
    });

    const calculatedScore = Number(((correctCount / questions.length) * 10).toFixed(1));

    // Save to student
    const student = storageService.getActiveStudent();
    student.preTestScore = calculatedScore;
    student.points = (student.points || 0) + 15;
    if (!student.badges.includes('badge-1')) {
      student.badges.push('badge-1'); // Mầm non tri thức
    }
    // Update competencies
    student.competencies.knowledge = Math.max(student.competencies.knowledge, 75 + correctCount * 5);
    student.competencies.selfStudy = Math.min(100, student.competencies.selfStudy + 5);

    storageService.updateStudent(student);
    onStudentUpdated();

    if (soundEnabled) aiService.playFanfareSound();
    setShowResult(true);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setShowHint(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={_onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
          <span>CHẶNG 1: KHÁM PHÁ NĂNG LỰC</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-orange-200 relative overflow-hidden">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-orange-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wide">
              <span>🎯 Chẩn Đoán Năng Lực Đầu Vào</span>
              <span>•</span>
              <span>Lớp 5B</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
              Khám Phá Điểm Mạnh Của Em
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bài chẩn đoán giúp xác định mức độ nắm kiến thức để MapAI gợi ý lộ trình học tập phù hợp nhất.
            </p>
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap gap-1.5">
            {(['Toán', 'Tiếng Việt', 'Khoa học', 'Lịch sử và Địa lí'] as SubjectType[]).map((subj) => (
              <button
                key={subj}
                onClick={() => {
                  setSelectedSubject(subj);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === subj
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {!showResult ? (
          <div className="mt-6 space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-slate-700">
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                Mức độ: {currentQ.level}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 font-heading leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl text-left text-sm font-semibold transition-all border-2 flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 scale-[1.01]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-white shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Hint Box (if toggled) */}
            {showHint && (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-800 animate-fadeIn flex items-start gap-2.5">
                <span className="text-lg">🤖</span>
                <div>
                  <span className="font-bold block text-sky-900 mb-0.5">
                    MapAI Gợi Ý Phương Pháp:
                  </span>
                  <span>{currentQ.hint}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-2 rounded-xl border border-sky-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? 'Ẩn gợi ý' : 'Hỏi gợi ý MapAI'}</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setShowHint(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Câu trước
                  </button>
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    disabled={answers[currentQuestionIndex] === undefined}
                    onClick={() => {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setShowHint(false);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-orange-200"
                  >
                    <span>Tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={answers[currentQuestionIndex] === undefined}
                    onClick={handleFinish}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Hoàn thành chẩn đoán</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="mt-6 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl mx-auto shadow-xl">
              🎯
            </div>

            <div>
              <div className="text-xs font-black uppercase text-orange-600 tracking-wider">
                Kết Quả Khám Phá Năng Lực
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
                “BẠN ĐÃ KHÁM PHÁ ĐƯỢC NĂNG LỰC CỦA MÌNH!”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                Chúc mừng <span className="font-bold text-orange-600">{activeStudent.name}</span>! Em đã hoàn thành xuất sắc bước đầu của hành trình chinh phục lớp 5.
              </p>
            </div>

            {/* AI Goal Proposal Box */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border border-orange-200 text-left max-w-xl mx-auto space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="font-bold text-orange-950 font-heading text-sm">
                  Kế Hoạch Cá Nhân Hóa Do MapAI Đề Xuất:
                </span>
              </div>
              <p className="text-xs text-orange-900 leading-relaxed">
                • <strong>Điểm mạnh:</strong> Khả năng nhận biết các quy tắc cốt lõi và tư duy liên kết câu hỏi rất tốt!
                <br />
                • <strong>Mục tiêu tuần tới:</strong> Ôn luyện thêm dạng bài toán vận dụng tỉ số và cùng bạn làm sơ đồ tư duy tóm tắt kiến thức.
                <br />
                • <strong>Phần thưởng:</strong> Đã cộng <strong>+15 điểm tích lũy</strong> và mở khóa huy hiệu <strong>🌱 Mầm non tri thức</strong>!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài kiểm tra</span>
              </button>

              <button
                onClick={onNextStage}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-sky-200"
              >
                <span>Chuyển sang Chặng 2: Hành Trình Tri Thức</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

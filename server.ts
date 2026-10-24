import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Status endpoint
  app.get('/api/status', (req: Request, res: Response) => {
    res.json({
      online: true,
      hasGemini: Boolean(apiKey),
      app: 'AI Bản Đồ Nhiệm Vụ - Lớp 5',
      school: 'Trường Tiểu học Khoái Châu 1',
      teacher: 'Cô Lê Thị Yến',
      class: '5B',
    });
  });

  // MapAI Tutor Chat endpoint
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, history, context, hintLevel } = req.body;

    if (!ai) {
      // Fallback offline pedagogical responses
      return res.json({
        reply: generateOfflineTutorReply(message, hintLevel),
        isOfflineFallback: true,
      });
    }

    try {
      const systemInstruction = `Bạn là MapAI - chú robot thông minh, đáng yêu và là gia sư học tập tận tâm của học sinh lớp 5B, Trường Tiểu học Khoái Châu 1.
Phong cách giao tiếp:
- Thân thiện, tươi vui, khích lệ, dùng ngôn ngữ trong sáng phù hợp trẻ 10-11 tuổi (xưng "mình" hoặc "MapAI", gọi học sinh là "bạn" hoặc "bạn nhỏ").
- Nguyên tắc sư phạm: KHÔNG ĐƯA NGAY ĐÁP ÁN CUỐI CÙNG. Hãy hướng dẫn bằng câu hỏi gợi mở, gợi ý từng bước để học sinh tự tư duy.
- Ba cấp độ gợi ý nếu được yêu cầu:
  + Gợi ý cấp độ 1: Nhắc lại quy tắc, công thức hoặc kiến thức cốt lõi.
  + Gợi ý cấp độ 2: Đưa ra ví dụ tương tự đơn giản hơn để học sinh liên hệ.
  + Gợi ý cấp độ 3: Hướng dẫn trình tự các bước thực hiện để bạn tự tìm ra kết quả.
- Nội dung gắn liền với chương trình Lớp 5 (GDPT 2018): Toán (phân số, số thập phân, hình học, chuyển động đều...), Tiếng Việt (từ đồng nghĩa, từ trái nghĩa, liên kết câu, tập làm văn...), Khoa học (năng lượng, môi trường, biến đổi chất...), Lịch sử & Địa lí (địa hình, khí hậu, các mốc son lịch sử hào hùng Việt Nam).
- Độ dài vừa phải, súc tích (100 - 150 từ), dễ đọc, có các icon sinh động (🌱, ⭐, 💡, 🚀).`;

      const promptContext = context ? `\n[Ngữ cảnh bài tập học sinh đang xem: ${context}]` : '';
      const promptLevel = hintLevel ? `\n[Cấp độ gợi ý yêu cầu: Cấp độ ${hintLevel}]` : '';

      const contents = `${promptContext}${promptLevel}\nHọc sinh hỏi: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        reply: response.text || 'MapAI luôn đồng hành cùng bạn! Hãy thử nhớ lại kiến thức bài học nhé!',
        isOfflineFallback: false,
      });
    } catch (error) {
      console.error('Error calling Gemini chat:', error);
      res.json({
        reply: generateOfflineTutorReply(message, hintLevel),
        isOfflineFallback: true,
      });
    }
  });

  // AI Quiz Generator endpoint for teachers or students
  app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
    const { subject, topic, grade = 5, level = 'Thông hiểu', count = 3 } = req.body;

    if (!ai) {
      return res.json({
        questions: getOfflineQuizQuestions(subject, topic, count),
        isOfflineFallback: true,
      });
    }

    try {
      const prompt = `Hãy tạo ${count} câu hỏi trắc nghiệm khách quan 4 lựa chọn (A, B, C, D) cho học sinh Lớp 5 theo Chương trình GDPT 2018.
Môn học: ${subject || 'Toán'}
Chủ đề: ${topic || 'Ôn tập'}
Mức độ yêu cầu: ${level} (Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao)

Trả về định dạng JSON thuần túy là một mảng các đối tượng có các trường:
- id: số thứ tự duy nhất (dạng số hoặc chuỗi)
- question: nội dung câu hỏi rõ ràng, chính xác khoa học
- options: mảng 4 chuỗi chứa phương án trả lời [ "A. ...", "B. ...", "C. ...", "D. ..." ]
- correctIndex: chỉ số đáp án đúng (0 cho A, 1 cho B, 2 cho C, 3 cho D)
- explanation: giải thích ngắn gọn, dễ hiểu vì sao chọn đáp án đó
- hint: gợi ý phương pháp giải để học sinh tự nghĩ nếu trả lời sai`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      res.json({
        questions: Array.isArray(parsed) ? parsed : (parsed.questions || []),
        isOfflineFallback: false,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.json({
        questions: getOfflineQuizQuestions(subject, topic, count),
        isOfflineFallback: true,
      });
    }
  });

  // AI Mind Map Generator endpoint
  app.post('/api/ai/suggest-mindmap', async (req: Request, res: Response) => {
    const { topic, subject } = req.body;

    if (!ai) {
      return res.json({
        mindmap: getOfflineMindMap(topic, subject),
        isOfflineFallback: true,
      });
    }

    try {
      const prompt = `Hãy lập một cấu trúc sơ đồ tư duy (Mind Map) cho học sinh lớp 5 về:
Chủ đề: "${topic}"
Môn học: "${subject || 'Khoa học'}"

Yêu cầu:
- Gốc (central): Tên chủ đề súc tích.
- Tối đa 4 - 6 nhánh chính (branches). Mỗi nhánh có tên ngắn gọn, màu sắc gợi ý, và 2-3 nhánh con (sub-branches).
- Phù hợp trình độ nhận thức học sinh lớp 5, từ ngữ chuẩn GDPT 2018.

Định dạng JSON trả về:
{
  "central": "${topic}",
  "color": "#1689F8",
  "branches": [
    {
      "id": "b1",
      "title": "Nhánh 1",
      "color": "#22C55E",
      "children": ["Ý nhỏ 1", "Ý nhỏ 2"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json({
        mindmap: data,
        isOfflineFallback: false,
      });
    } catch (error) {
      console.error('Error generating mindmap:', error);
      res.json({
        mindmap: getOfflineMindMap(topic, subject),
        isOfflineFallback: true,
      });
    }
  });

  // AI Reflection & Praise feedback
  app.post('/api/ai/feedback', async (req: Request, res: Response) => {
    const { learned, difficulty, tomorrowGoal, mood, studentName = 'Học sinh' } = req.body;

    if (!ai) {
      return res.json({
        feedback: `MapAI rất tự hào về tinh thần tự học của ${studentName}! Mỗi khó khăn hôm nay đều là bước đệm giúp em tự tin hơn vào ngày mai. Chúc em hoàn thành mục tiêu mới thật xuất sắc nhé! 🌟`,
        isOfflineFallback: true,
      });
    }

    try {
      const prompt = `Viết một lời nhận xét ngắn gọn (3-4 câu), ấm áp, tràn đầy cảm hứng và động viên cho học sinh Lớp 5:
Tên học sinh: ${studentName}
Cảm xúc hôm nay: ${mood || 'Vui vẻ'}
Điều đã học được: "${learned}"
Khó khăn gặp phải: "${difficulty}"
Mục tiêu ngày mai: "${tomorrowGoal}"

Yêu cầu: Động viên nỗ lực, khen ngợi tinh thần tự học, gợi ý một mẹo nhỏ tích cực, không phán xét tiêu cực.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });

      res.json({
        feedback: response.text?.trim() || 'MapAI chúc bạn một ngày học tập thật nhiều niềm vui và tiến bộ!',
        isOfflineFallback: false,
      });
    } catch (error) {
      console.error('Error generating feedback:', error);
      res.json({
        feedback: `MapAI rất tự hào về tinh thần tự học của ${studentName}! Hãy giữ vững năng lượng tích cực này nhé! 🚀`,
        isOfflineFallback: true,
      });
    }
  });

  // Serve static files or Vite dev middleware
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Bản Đồ Nhiệm Vụ server running on http://0.0.0.0:${PORT}`);
  });
}

function generateOfflineTutorReply(question: string, level?: number): string {
  const qLower = (question || '').toLowerCase();

  if (qLower.includes('phân số') || qLower.includes('mẫu số')) {
    if (level === 1) {
      return '💡 Gợi ý Cấp độ 1 (Quy tắc): Muốn cộng hoặc trừ hai phân số khác mẫu số, bước đầu tiên chúng mình cần quy đồng mẫu số hai phân số đó để đưa về cùng một mẫu số chung nhé!';
    }
    if (level === 2) {
      return '🔍 Gợi ý Cấp độ 2 (Ví dụ): Giống như cộng 1/2 và 1/4 vậy. Ta thấy 4 chia hết cho 2, nên mẫu số chung là 4. Ta quy đồng 1/2 = 2/4, sau đó tính 2/4 + 1/4 = 3/4. Rất dễ đúng không?';
    }
    return '🚀 Gợi ý Cấp độ 3 (Các bước thực hiện):\nBước 1: Tìm mẫu số chung nhỏ nhất của hai phân số.\nBước 2: Tìm thừa số phụ và nhân cả tử số lẫn mẫu số.\nBước 3: Cộng các tử số lại và giữ nguyên mẫu số chung.\nBước 4: Rút gọn phân số về tối giản nếu có thể. Bạn thử làm lại xem nào!';
  }

  if (qLower.includes('năng lượng') || qLower.includes('khoa học')) {
    return '🌱 MapAI chia sẻ cùng bạn: Năng lượng có ở khắp nơi quanh chúng ta: Mặt Trời, gió, nước chảy, chất đốt, điện năng... Bạn hãy chú ý đến việc sử dụng năng lượng tiết kiệm và an toàn nhé! Bạn đang gặp khó ở phần nào của bài học này?';
  }

  if (qLower.includes('từ đồng nghĩa') || qLower.includes('tiếng việt')) {
    return '📚 MapAI mách bạn: Từ đồng nghĩa là những từ có nghĩa giống nhau hoặc gần giống nhau (như: siêng năng, chăm chỉ, cần cù). Có từ đồng nghĩa hoàn toàn có thể thay thế cho nhau, và có từ đồng nghĩa không hoàn toàn cần lựa chọn cho phù hợp ngữ cảnh.';
  }

  return '🤖 MapAI luôn ở đây để giúp bạn! Bạn hãy đọc kĩ đề bài, xác định xem bài toán cho biết điều gì và yêu cầu tìm điều gì. Nếu chưa rõ, hãy bấm vào nút "Gợi ý Cấp độ 1" để MapAI nhắc lại quy tắc cơ bản nhé!';
}

function getOfflineQuizQuestions(subject?: string, topic?: string, count: number = 3) {
  const allMath = [
    {
      id: 101,
      question: 'Tính: 3/4 + 1/8 bằng bao nhiêu?',
      options: ['A. 5/8', 'B. 7/8', 'C. 1', 'D. 3/8'],
      correctIndex: 1,
      explanation: 'Quy đồng mẫu số: 3/4 = 6/8. Sau đó tính 6/8 + 1/8 = 7/8.',
      hint: 'Hãy quy đồng mẫu số của 3/4 về mẫu số 8 trước khi thực hiện phép cộng.',
    },
    {
      id: 102,
      question: 'Phân số 25/100 được viết dưới dạng số thập phân là:',
      options: ['A. 2,5', 'B. 0,025', 'C. 0,25', 'D. 25,0'],
      correctIndex: 2,
      explanation: '25 chia cho 100 bằng 0,25.',
      hint: 'Chia cho 100 nghĩa là dời dấu phẩy sang bên trái 2 chữ số.',
    },
    {
      id: 103,
      question: 'Một hình chữ nhật có chiều dài 12m, chiều rộng bằng 2/3 chiều dài. Diện tích hình chữ nhật là:',
      options: ['A. 96 m²', 'B. 72 m²', 'C. 40 m²', 'D. 80 m²'],
      correctIndex: 0,
      explanation: 'Chiều rộng là: 12 × 2/3 = 8 (m). Diện tích là: 12 × 8 = 96 (m²).',
      hint: 'Tính chiều rộng trước bằng cách lấy chiều dài nhân với 2/3, sau đó tính diện tích bằng dài nhân rộng.',
    },
    {
      id: 104,
      question: 'Một người đi xe máy với vận tốc 40 km/giờ trong thời gian 2 giờ 30 phút. Quãng đường người đó đã đi là:',
      options: ['A. 80 km', 'B. 90 km', 'C. 100 km', 'D. 120 km'],
      correctIndex: 2,
      explanation: 'Đổi 2 giờ 30 phút = 2,5 giờ. Quãng đường s = v × t = 40 × 2,5 = 100 (km).',
      hint: 'Nhớ đổi 2 giờ 30 phút ra số thập phân trước khi nhân với vận tốc.',
    },
  ];

  const allVietnamese = [
    {
      id: 201,
      question: 'Cặp từ nào dưới đây là cặp từ đồng nghĩa?',
      options: ['A. Chăm chỉ - Lười biếng', 'B. Siêng năng - Cần cù', 'C. Cao - Thấp', 'D. Thông minh - Ngốc nghếch'],
      correctIndex: 1,
      explanation: '"Siêng năng" và "Cần cù" đều mang nghĩa chịu khó làm việc, học tập.',
      hint: 'Từ đồng nghĩa là các từ có nghĩa giống nhau hoặc gần giống nhau.',
    },
    {
      id: 202,
      question: 'Trong câu "Mùa xuân, trăm hoa đua nở rực rỡ.", bộ phận trạng ngữ là:',
      options: ['A. Mùa xuân', 'B. trăm hoa', 'C. đua nở', 'D. rực rỡ'],
      correctIndex: 0,
      explanation: '"Mùa xuân" là trạng ngữ chỉ thời gian đứng ở đầu câu.',
      hint: 'Trạng ngữ chỉ thời gian trả lời cho câu hỏi "Khi nào?".',
    },
    {
      id: 203,
      question: 'Biện pháp tu từ nào được sử dụng trong câu: "Dòng sông như dải lụa mềm vắt ngang qua cánh đồng"?',
      options: ['A. Nhân hóa', 'B. So sánh', 'C. Điệp từ', 'D. Đảo ngữ'],
      correctIndex: 1,
      explanation: 'Câu sử dụng từ so sánh "như" để ví dòng sông với dải lụa mềm.',
      hint: 'Hãy chú ý đến từ so sánh "như" trong câu.',
    },
  ];

  const allScience = [
    {
      id: 301,
      question: 'Nguồn năng lượng nào sau đây là nguồn năng lượng tái tạo và thân thiện với môi trường?',
      options: ['A. Than đá', 'B. Dầu mỏ', 'C. Năng lượng gió và ánh sáng mặt trời', 'D. Khí đốt tự nhiên'],
      correctIndex: 2,
      explanation: 'Gió và ánh sáng mặt trời là nguồn năng lượng tái tạo vô tận và không gây khói bụi.',
      hint: 'Nguồn năng lượng tái tạo là nguồn tự nhiên có thể phục hồi liên tục.',
    },
    {
      id: 302,
      question: 'Để phòng tránh tai nạn do điện gây ra trong gia đình, chúng ta KHÔNG NÊN làm điều gì?',
      options: ['A. Rút phích cắm khi không sử dụng', 'B. Sờ tay ướt vào ổ cắm điện', 'C. Báo người lớn khi dây điện hở', 'D. Sử dụng thiết bị điện đúng cách'],
      correctIndex: 1,
      explanation: 'Nước dẫn điện rất nguy hiểm, chạm tay ướt vào ổ điện có thể bị điện giật.',
      hint: 'Cơ thể người và nước dẫn điện rất nhanh, nguy hiểm đến tính mạng.',
    },
  ];

  const allHistory = [
    {
      id: 401,
      question: 'Bác Hồ đọc Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?',
      options: ['A. 19/8/1945', 'B. 2/9/1945', 'C. 7/5/1954', 'D. 30/4/1975'],
      correctIndex: 1,
      explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đã đọc Tuyên ngôn Độc lập.',
      hint: 'Đây chính là ngày Quốc khánh của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
    },
    {
      id: 402,
      question: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
      options: ['A. 1945', 'B. 1954', 'C. 1968', 'D. 1975'],
      correctIndex: 1,
      explanation: 'Ngày 7 tháng 5 năm 1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm Đờ Cát, kết thúc thắng lợi chiến dịch Điện Biên Phủ.',
      hint: 'Chiến dịch kết thúc cuộc kháng chiến chống thực dân Pháp.',
    },
  ];

  const subj = (subject || '').toLowerCase();
  let pool = allMath;
  if (subj.includes('tiếng việt') || subj.includes('văn')) pool = allVietnamese;
  else if (subj.includes('khoa học')) pool = allScience;
  else if (subj.includes('lịch sử') || subj.includes('địa lí') || subj.includes('sử')) pool = allHistory;

  return pool.slice(0, count);
}

function getOfflineMindMap(topic?: string, subject?: string) {
  const t = topic || 'Năng lượng và Cuộc sống';
  return {
    central: t,
    color: '#1689F8',
    branches: [
      {
        id: 'b1',
        title: 'Nguồn năng lượng',
        color: '#22C55E',
        children: ['Mặt Trời', 'Gió và Nước chảy', 'Điện và Chất đốt'],
      },
      {
        id: 'b2',
        title: 'Vai trò ứng dụng',
        color: '#FF9635',
        children: ['Thắp sáng & Sưởi ấm', 'Vận hành máy móc', 'Phương tiện giao thông'],
      },
      {
        id: 'b3',
        title: 'Sử dụng an toàn & Tiết kiệm',
        color: '#9254DE',
        children: ['Tắt khi không sử dụng', 'Không nghịch ổ điện', 'Bảo vệ nguồn tài nguyên'],
      },
      {
        id: 'b4',
        title: 'Hành động của em',
        color: '#FF5FA2',
        children: ['Tuyên truyền bạn bè', 'Tận dụng ánh sáng tự nhiên'],
      },
    ],
  };
}

startServer();

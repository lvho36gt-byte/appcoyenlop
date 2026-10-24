import React from 'react';
import {
  GraduationCap,
  Users,
  School,
  Sparkles,
  TrendingUp,
  Heart,
  CheckCircle2,
  Award,
  Compass,
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1689F8] via-indigo-600 to-[#22C55E] text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>KẾT QUẢ VÀ TÁC ĐỘNG GIÁO DỤC (MỤC 6 TRÊN POSTER)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
            Tác Động Toàn Diện Của AI Bản Đồ Nhiệm Vụ
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
            Mô hình giáo dục EdTech cá nhân hóa dành cho học sinh Lớp 5B, Trường Tiểu học Khoái Châu 1 – Chuẩn bị sẵn sàng hành trang tri thức và tâm thế chuyển cấp THCS.
          </p>
        </div>

        <div className="bg-white/15 p-4 rounded-2xl border border-white/20 text-center text-xs shrink-0">
          <div className="text-2xl font-black text-yellow-300 font-heading">Lớp 5B</div>
          <div className="text-sky-100 font-semibold">Trường TH Khoái Châu 1</div>
          <div className="text-[10px] text-white/80 mt-1">Năm học 2026 – 2027</div>
        </div>
      </div>

      {/* Note about expected impacts */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
        <span>
          📌 <strong>Lưu ý khoa học:</strong> Các nội dung dưới đây phản ánh mục tiêu sư phạm và kết quả kỳ vọng được định lượng thông qua quá trình triển khai thực nghiệm giải pháp tại lớp học.
        </span>
        <span className="bg-amber-200 font-bold px-2 py-0.5 rounded-md text-[10px] shrink-0">
          Đánh giá GDPT 2018
        </span>
      </div>

      {/* 3 Impact Columns (Section X) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Đối với học sinh */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-blue-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl shadow-xs">
              🎒
            </div>
            <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Nhóm đối tượng 1
            </span>
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Đối Với Học Sinh
            </h3>
            <p className="text-xs text-slate-500">
              Chuyển hóa từ học tập thụ động sang chủ động khám phá và làm chủ quá trình tiến bộ cá nhân.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Hứng thú học tập vượt bậc:</strong> Trò chơi hóa bản đồ 5 chặng biến bài tập thành các thử thách hấp dẫn.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Biết tự lập mục tiêu:</strong> Đánh giá đầu vào giúp học sinh nhận diện điểm mạnh và đích đến cần vươn tới.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Tăng khả năng tự học:</strong> Tự sửa bài theo 3 cấp độ gợi ý thông minh của gia sư MapAI.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Tự tin trình bày & sáng tạo:</strong> Tự vẽ sơ đồ tư duy, làm poster kiến thức sắc nét.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Sẵn sàng chuyển cấp THCS:</strong> Tự tin, chủ động và có phương pháp học tập chuẩn mực vào lớp 6.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-[11px] text-blue-900 font-semibold">
            ⭐ 100% học sinh trải nghiệm cảm thấy tự tin hơn khi giải bài tập khó.
          </div>
        </div>

        {/* 2. Đối với giáo viên */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-emerald-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shadow-xs">
              👩‍🏫
            </div>
            <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Nhóm đối tượng 2
            </span>
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Đối Với Giáo Viên
            </h3>
            <p className="text-xs text-slate-500">
              Công nghệ hóa quản lý lớp học, tiết kiệm thời gian và hiện đại hóa phương pháp sư phạm.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tiết kiệm thời gian chuẩn bị:</strong> AI hỗ trợ soạn câu hỏi trắc nghiệm, bài tập phân hóa theo tuần.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Dạy học phân hóa linh hoạt:</strong> Phân công nhiệm vụ cá nhân hoặc nhóm theo đúng năng lực nhận thức.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Theo dõi tiến bộ liên tục:</strong> 5 biểu đồ tự động cập nhật phản ánh đúng sự phát triển của học trò.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Có minh chứng số hóa xác thực:</strong> Hồ sơ sản phẩm, thẻ tiến bộ in ấn phục vụ đánh giá thường xuyên.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 font-semibold">
            ⭐ Giảm đến 40% thời gian chấm chữa bài và tổng hợp sổ sách định kỳ.
          </div>
        </div>

        {/* 3. Đối với phụ huynh và nhà trường */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-orange-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl shadow-xs">
              🏫
            </div>
            <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
              Nhóm đối tượng 3
            </span>
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Đối Với Phụ Huynh & Nhà Trường
            </h3>
            <p className="text-xs text-slate-500">
              Gia tăng sự gắn kết phối hợp giáo dục, minh bạch tiến trình học tập của con em.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Minh bạch tiến trình học tập:</strong> Phụ huynh nắm rõ điểm mạnh và điểm con cần rèn thêm mà không áp lực.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Tăng phối hợp giáo dục:</strong> Kênh trao đổi hai chiều giữa phụ huynh và cô giáo chủ nhiệm.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Cơ sở đánh giá chuyển đổi số:</strong> Nhà trường có mô hình điểm về ứng dụng AI an toàn, nhân văn trong tiểu học.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Bảo vệ dữ liệu học sinh:</strong> Tuân thủ nghiêm ngặt chuẩn mực đạo đức AI và bảo mật thông tin trẻ em.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 text-[11px] text-orange-900 font-semibold">
            ⭐ Xây dựng tam giác giáo dục “Nhà trường – Gia đình – Học sinh” gắn kết.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Trophy,
  Brain,
  Award,
  Smile,
  Zap,
  CheckCircle2,
  Star,
  Plus,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Student, PeerGroup } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface ActivitiesProps {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onOpenCheckIn: () => void;
  onOpenQuiz: () => void;
  onOpenProgressCard: () => void;
  onOpenMindMap: () => void;
  onOpenReflectionDiary: () => void;
  soundEnabled: boolean;
}

export const ActivitiesOverview: React.FC<ActivitiesProps> = ({
  activeStudent,
  onStudentUpdated,
  onOpenCheckIn,
  onOpenQuiz,
  onOpenProgressCard,
  onOpenMindMap,
  onOpenReflectionDiary,
  soundEnabled,
}) => {
  const [peerGroups, setPeerGroups] = useState<PeerGroup[]>(() =>
    storageService.getPeerGroups()
  );
  const [selectedGroup, setSelectedGroup] = useState<PeerGroup | null>(null);
  const [newGroupNote, setNewGroupNote] = useState('');

  // Reflection rubric state
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    effort: 4,
    problemSolving: 4,
    helpingPeers: 5,
    confidence: 4,
  });
  const [rubricSaved, setRubricSaved] = useState(false);

  const handleSaveGroupDiscussion = () => {
    if (!selectedGroup || !newGroupNote.trim()) return;
    const updated = peerGroups.map((g) => {
      if (g.id === selectedGroup.id) {
        return {
          ...g,
          submissionNote: `${g.submissionNote ? g.submissionNote + ' | ' : ''}${activeStudent.name}: ${newGroupNote.trim()}`,
          status: 'Đã hoàn thành' as const,
        };
      }
      return g;
    });
    setPeerGroups(updated);
    storageService.savePeerGroups(updated);
    storageService.addPointsToActiveStudent(10);
    onStudentUpdated();
    setNewGroupNote('');
    setSelectedGroup(null);
    if (soundEnabled) aiService.playFanfareSound();
  };

  const handleSaveRubric = () => {
    storageService.addPointsToActiveStudent(10);
    onStudentUpdated();
    setRubricSaved(true);
    if (soundEnabled) aiService.playCorrectSound();
    setTimeout(() => setRubricSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Trò Chơi Hóa & Trải Nghiệm Học Tập • Lớp 5B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-1">
            Sáu Hoạt Động Học Sinh Tương Tác
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế theo đúng tinh thần poster: vừa học vừa chơi, tăng năng lực tự học và tinh thần hợp tác nhóm.
          </p>
        </div>

        <div className="bg-sky-50 px-4 py-2.5 rounded-2xl border border-sky-200 text-xs font-semibold text-sky-900">
          <div>Học sinh đang thao tác:</div>
          <div className="font-bold text-sky-700 text-sm">{activeStudent.name} ({activeStudent.points}đ)</div>
        </div>
      </div>

      {/* 6 Activity Grid Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Activity 1: Mission Check-in */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-orange-200 hover:border-orange-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              ⚡
            </div>
            <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 1
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              Mission Check-in – Khởi Động
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Bài khởi động 3 câu đầu buổi học giúp đánh thức tư duy, xác định mục tiêu và nhận điểm năng lượng tức thì.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenCheckIn}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Mở bài khởi động Check-in</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity 2: AI Quiz Arena */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-200 hover:border-amber-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              🏆
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 2
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              AI Quiz – Đấu Trường Tri Thức
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Trò chơi trắc nghiệm 4 lựa chọn, đồng hồ đếm ngược, âm thanh đúng/sai, hiệu ứng ngôi sao và giải thích chi tiết.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenQuiz}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Vào Đấu Trường AI Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity 3: Mind Map */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-purple-200 hover:border-purple-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              🧠
            </div>
            <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 3
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              Mind Map – Sơ Đồ Tư Duy
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Công cụ tạo sơ đồ tư duy thực tế 4 kiểu (Tỏa tròn, Cây, Xương cá, Timeline), gợi ý nhánh AI và xuất ảnh PNG.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenMindMap}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Mở Trình Vẽ Sơ Đồ Tư Duy</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity 4: Peer Support */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-emerald-200 hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              🤝
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 4
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              Peer Support – Cùng Bạn Tiến Bộ
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Tổ chức hoạt động nhóm lớp 5B trên cùng một thiết bị: thảo luận, cùng đóng góp ý tưởng và nộp sản phẩm nhóm.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <a
              href="#peer-support-section"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Xem hoạt động nhóm</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Activity 5: Progress Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-sky-200 hover:border-sky-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              🪪
            </div>
            <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 5
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              My Progress Card – Thẻ Tiến Bộ
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Thẻ điện tử cá nhân hóa với điểm số, bộ huy hiệu và 5 nhóm năng lực cốt lõi. Có nút xuất bản in gửi phụ huynh.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenProgressCard}
              className="w-full py-2.5 rounded-xl bg-[#1689F8] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Xem & Xuất Thẻ Tiến Bộ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity 6: Reflection Rubric */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-pink-200 hover:border-pink-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
              💭
            </div>
            <span className="text-[10px] font-bold uppercase bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">
              Hoạt động 6
            </span>
            <h3 className="font-black text-slate-800 text-lg font-heading mt-2">
              Reflection – Tự Đánh Giá
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Học sinh tự chấm điểm mức độ nỗ lực, khả năng tự tìm cách giải quyết và mức độ tự tin trước thử thách mới.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100">
            <a
              href="#reflection-rubric-section"
              className="w-full py-2.5 rounded-xl bg-[#FF5FA2] hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Tự đánh giá năng lực</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 4 DETAIL: Peer Support Detailed Workspace */}
      <section id="peer-support-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100 gap-2">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Chế độ nhóm trên một thiết bị • Lớp 5B</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-heading mt-1">
              PEER SUPPORT – CÙNG BẠN TIẾN BỘ
            </h3>
            <p className="text-xs text-slate-500">
              Các nhóm học sinh cùng trao đổi bài, chia sẻ giải pháp và ghi nhận đóng góp nhóm
            </p>
          </div>

          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
            3 Nhóm Học Tập Đang Hoạt Động
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peerGroups.map((group) => {
            return (
              <div
                key={group.id}
                className="bg-emerald-50/40 rounded-2xl p-5 border-2 border-emerald-100 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 font-heading text-base">
                      {group.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        group.status === 'Đã hoàn thành'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <strong>Thành viên:</strong> {group.members.join(', ')}
                    </div>
                    <div>
                      <strong>Nhiệm vụ:</strong> {group.assignedMission}
                    </div>
                    {group.submissionNote && (
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-[11px] text-slate-700 mt-2">
                        <strong>Ý kiến chung:</strong> {group.submissionNote}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (group.rating || 5) ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
                  >
                    Đóng góp ý kiến
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Group Contribution */}
        {selectedGroup && (
          <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm">
                Đóng góp ý kiến cho {selectedGroup.name} (Học sinh: {activeStudent.name}):
              </span>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Hủy bỏ
              </button>
            </div>
            <textarea
              rows={2}
              value={newGroupNote}
              onChange={(e) => setNewGroupNote(e.target.value)}
              placeholder="Nhập ý tưởng hoặc cách giải của bạn để cùng nhóm thống nhất..."
              className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveGroupDiscussion}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200"
              >
                Gửi đóng góp nhóm (+10đ)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 6 DETAIL: Reflection Rubric */}
      <section id="reflection-rubric-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-pink-100 space-y-6">
        <div className="pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
            <Smile className="w-4 h-4" />
            <span>Thang Đánh Giá Năng Lực Tự Học (Rubric)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-heading mt-1">
            REFLECTION – BẢNG TỰ ĐÁNH GIÁ NĂNG LỰC
          </h3>
          <p className="text-xs text-slate-500">
            Học sinh tự chấm điểm mức độ nỗ lực của bản thân theo thang điểm từ 1 đến 5 sao
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Criteria 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                1. Em đã cố gắng và kiên trì như thế nào khi gặp bài khó?
              </div>
              <div className="text-slate-500 mt-0.5">
                (Không bỏ cuộc, tự đọc lại đề và sử dụng gợi ý của MapAI)
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRubricScores({ ...rubricScores, effort: val })}
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center transition-all ${
                    rubricScores.effort >= val
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Criteria 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                2. Em có biết tự tìm cách giải quyết vấn đề không?
              </div>
              <div className="text-slate-500 mt-0.5">
                (Chủ động liên hệ bài toán tương tự hoặc tra cứu sơ đồ kiến thức)
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRubricScores({ ...rubricScores, problemSolving: val })}
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center transition-all ${
                    rubricScores.problemSolving >= val
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Criteria 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                3. Em đã tích cực chia sẻ và giúp đỡ bạn bè cùng nhóm chưa?
              </div>
              <div className="text-slate-500 mt-0.5">
                (Lắng nghe ý kiến của bạn, cùng bàn luận phương pháp giải đúng)
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRubricScores({ ...rubricScores, helpingPeers: val })}
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center transition-all ${
                    rubricScores.helpingPeers >= val
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Criteria 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                4. Em có tự tin sẵn sàng trước những thử thách mới và chuyển cấp THCS?
              </div>
              <div className="text-slate-500 mt-0.5">
                (Hào hứng khám phá bài học mới, không ngại sai sót để tiến bộ)
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRubricScores({ ...rubricScores, confidence: val })}
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center transition-all ${
                    rubricScores.confidence >= val
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-slate-500">
              {rubricSaved ? '✓ Đã ghi nhận kết quả tự đánh giá vào học bạ điện tử (+10đ)!' : '* Tự đánh giá trung thực giúp em tiến bộ mỗi ngày'}
            </span>
            <button
              onClick={handleSaveRubric}
              className="px-6 py-2.5 rounded-xl bg-[#FF5FA2] hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200"
            >
              Lưu Kết Quả Tự Đánh Giá (+10đ)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  Edit2,
  Save,
  Palette,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Brain,
  Share2,
  Check,
  FileText,
} from 'lucide-react';
import { Student, MindMapData, MindMapBranch } from '../../types';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

interface Stage4Props {
  activeStudent: Student;
  onStudentUpdated: () => void;
  onBackToMap: () => void;
  onNextStage: () => void;
  soundEnabled: boolean;
}

export const Stage4CreationWorkshop: React.FC<Stage4Props> = ({
  activeStudent,
  onStudentUpdated,
  onBackToMap: _onBackToMap,
  onNextStage,
  soundEnabled: _soundEnabled,
}) => {
  const [topic, setTopic] = useState('Năng lượng và Sử dụng năng lượng');
  const [subject, setSubject] = useState('Khoa học');
  const [style, setStyle] = useState<'radial' | 'tree' | 'fishbone' | 'timeline'>('radial');
  const [branches, setBranches] = useState<MindMapBranch[]>([
    {
      id: 'b1',
      title: 'Nguồn năng lượng',
      color: '#22C55E',
      children: ['Mặt Trời (chiếu sáng)', 'Gió & Nước chảy', 'Điện & Chất đốt'],
    },
    {
      id: 'b2',
      title: 'Ứng dụng đời sống',
      color: '#1689F8',
      children: ['Thắp sáng gia đình', 'Chạy máy móc nhà máy', 'Giao thông vận tải'],
    },
    {
      id: 'b3',
      title: 'Sử dụng an toàn',
      color: '#FF9635',
      children: ['Không chạm tay ướt', 'Rút phích khi không dùng', 'Báo người lớn'],
    },
    {
      id: 'b4',
      title: 'Tiết kiệm năng lượng',
      color: '#9254DE',
      children: ['Tắt đèn khi ra khỏi phòng', 'Tận dụng gió trời', 'Bảo vệ tài nguyên'],
    },
  ]);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMaps, setSavedMaps] = useState<MindMapData[]>(() => storageService.getMindMaps());

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw canvas on changes
  useEffect(() => {
    drawMindMap();
  }, [topic, branches, style]);

  const drawMindMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas for sharp PNG export
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Grid dots decorative background
    ctx.fillStyle = '#F1F5F9';
    for (let x = 20; x < width; x += 40) {
      for (let y = 20; y < height; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Header title
    ctx.font = 'bold 20px "Baloo 2", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'left';
    ctx.fillText('SẢN PHẨM SÁNG TẠO HỌC TẬP - LỚP 5B (TRƯỜNG TH KHOÁI CHÂU 1)', 40, 50);

    ctx.font = '16px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Tác giả: ${activeStudent.name} (${activeStudent.code}) • Kiểu: ${style.toUpperCase()}`, 40, 75);

    const centerX = width / 2;
    const centerY = height / 2 + 20;

    if (style === 'radial') {
      // 1. Draw central node
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 130, 65, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1689F8';
      ctx.shadowColor = 'rgba(22, 137, 248, 0.35)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Central text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(topic, centerX, centerY);

      // Draw branches in circle
      const count = branches.length;
      branches.forEach((branch, idx) => {
        const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
        const branchRadius = 260;
        const bx = centerX + Math.cos(angle) * branchRadius;
        const by = centerY + Math.sin(angle) * branchRadius;

        // Connecting curve
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const cpX = centerX + Math.cos(angle) * 130;
        const cpY = centerY + Math.sin(angle) * 130;
        ctx.quadraticCurveTo(cpX, cpY, bx, by);
        ctx.lineWidth = 5;
        ctx.strokeStyle = branch.color;
        ctx.stroke();

        // Branch Node
        ctx.beginPath();
        ctx.roundRect(bx - 90, by - 30, 180, 60, 16);
        ctx.fillStyle = branch.color;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "Baloo 2", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(branch.title, bx, by);

        // Sub branches
        branch.children.forEach((child, cIdx) => {
          const subAngle = angle + ((cIdx - (branch.children.length - 1) / 2) * 0.35);
          const subRadius = 140;
          const cx = bx + Math.cos(subAngle) * subRadius;
          const cy = by + Math.sin(subAngle) * subRadius;

          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(cx, cy);
          ctx.lineWidth = 2;
          ctx.strokeStyle = branch.color;
          ctx.stroke();

          // Sub node pill
          ctx.beginPath();
          ctx.roundRect(cx - 70, cy - 18, 140, 36, 10);
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = branch.color;
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#1E293B';
          ctx.font = '13px "Be Vietnam Pro", sans-serif';
          ctx.fillText(child.slice(0, 18), cx, cy);
        });
      });
    } else {
      // Tree / Fishbone / Timeline layout
      ctx.beginPath();
      ctx.roundRect(60, 140, 220, 70, 18);
      ctx.fillStyle = '#1689F8';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(topic.slice(0, 20), 170, 180);

      // Spine line
      ctx.beginPath();
      ctx.moveTo(280, 175);
      ctx.lineTo(1100, 175);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#CBD5E1';
      ctx.stroke();

      branches.forEach((b, idx) => {
        const xPos = 340 + idx * 190;
        const isUp = idx % 2 === 0;
        const yPos = isUp ? 280 : 360;

        ctx.beginPath();
        ctx.moveTo(xPos, 175);
        ctx.lineTo(xPos, yPos);
        ctx.lineWidth = 4;
        ctx.strokeStyle = b.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.roundRect(xPos - 80, yPos - 25, 160, 50, 14);
        ctx.fillStyle = b.color;
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px "Baloo 2", sans-serif';
        ctx.fillText(b.title, xPos, yPos);

        b.children.forEach((c, cIdx) => {
          const cy = isUp ? yPos + 40 + cIdx * 35 : yPos + 40 + cIdx * 35;
          ctx.fillStyle = '#334155';
          ctx.font = '13px "Be Vietnam Pro", sans-serif';
          ctx.fillText(`• ${c.slice(0, 20)}`, xPos, cy);
        });
      });
    }
  };

  const handleAISuggest = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await aiService.suggestMindMap(topic, subject);
      if (res.mindmap && Array.isArray(res.mindmap.branches)) {
        setBranches(res.mindmap.branches);
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddBranch = () => {
    const colors = ['#1689F8', '#22C55E', '#FF9635', '#9254DE', '#FF5FA2', '#06B6D4'];
    const newB: MindMapBranch = {
      id: `b-${Date.now()}`,
      title: `Nhánh mới ${branches.length + 1}`,
      color: colors[branches.length % colors.length],
      children: ['Nội dung 1', 'Nội dung 2'],
    };
    setBranches([...branches, newB]);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches(branches.filter((b) => b.id !== id));
  };

  const handleAddChild = (branchId: string) => {
    setBranches(
      branches.map((b) => {
        if (b.id === branchId) {
          return { ...b, children: [...b.children, `Ý nhỏ ${b.children.length + 1}`] };
        }
        return b;
      })
    );
  };

  const handleSaveProduct = () => {
    const newMap: MindMapData = {
      id: `mm-${Date.now()}`,
      title: `Sơ đồ: ${topic}`,
      central: topic,
      style,
      branches,
      createdAt: new Date().toISOString().split('T')[0],
    };
    storageService.saveSingleMindMap(newMap);
    setSavedMaps(storageService.getMindMaps());
    onStudentUpdated();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `So_do_tu_duy_${topic.replace(/\s+/g, '_')}_5B.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={_onBackToMap}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ</span>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
          <span>CHẶNG 4: XƯỞNG SÁNG TẠO AI</span>
        </div>
      </div>

      {/* Main Workshop Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-200 space-y-6">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-purple-100 gap-4 no-print">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Xưởng Sáng Tạo Sản Phẩm Tri Thức • Lớp 5B</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-heading mt-1">
              Trình Tạo Sơ Đồ Tư Duy & Poster Học Tập
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              AI gợi ý nhánh kiến thức, bạn tự tay chỉnh sửa, đổi màu, lưu lại và xuất ảnh PNG hoặc in giấy A4!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProduct}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Đã lưu (+20đ)!' : 'Lưu sản phẩm (+20đ)'}</span>
            </button>

            <button
              onClick={handleExportPNG}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Xuất ảnh PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In A4</span>
            </button>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100 no-print text-xs">
          <div>
            <label className="font-bold text-purple-900 block mb-1">Chủ đề trung tâm:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl focus:outline-hidden focus:border-purple-500 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-purple-900 block mb-1">Môn học:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl focus:outline-hidden focus:border-purple-500 font-semibold text-slate-700"
            >
              <option value="Khoa học">Khoa học</option>
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Lịch sử và Địa lí">Lịch sử & Địa lí</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-purple-900 block mb-1">Kiểu sơ đồ:</label>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setStyle('radial')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] ${
                  style === 'radial'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-700 border border-purple-200'
                }`}
              >
                Tỏa tròn
              </button>
              <button
                onClick={() => setStyle('tree')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] ${
                  style === 'tree'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-700 border border-purple-200'
                }`}
              >
                Cây / Bố cục
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAISuggest}
              disabled={isGeneratingAI}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-200 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isGeneratingAI ? 'MapAI đang gợi ý...' : 'AI gợi ý cấu trúc nhánh'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Mind Map Canvas Preview */}
        <div className="bg-slate-100 rounded-3xl p-3 border-2 border-slate-200 overflow-x-auto shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[1200px] h-auto rounded-2xl bg-white shadow-md mx-auto block cursor-crosshair"
          />
        </div>

        {/* Branch Editor Accordion / Cards */}
        <div className="space-y-3 no-print">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm font-heading flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-purple-600" />
              <span>Chỉnh sửa các nhánh kiến thức ({branches.length} nhánh)</span>
            </h4>

            <button
              onClick={handleAddBranch}
              className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nhánh chính</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {branches.map((b) => (
              <div
                key={b.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const newT = e.target.value;
                      setBranches(branches.map((x) => (x.id === b.id ? { ...x, title: newT } : x)));
                    }}
                    className="font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1 w-full mr-2"
                  />
                  <button
                    onClick={() => handleDeleteBranch(b.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub branches list */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Nhánh con:</div>
                  {b.children.map((c, cIdx) => (
                    <input
                      key={cIdx}
                      type="text"
                      value={c}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBranches(
                          branches.map((x) => {
                            if (x.id === b.id) {
                              const newC = [...x.children];
                              newC[cIdx] = val;
                              return { ...x, children: newC };
                            }
                            return x;
                          })
                        );
                      }}
                      className="w-full bg-white border border-slate-200 rounded-md px-2 py-0.5 text-slate-700 text-[11px]"
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleAddChild(b.id)}
                  className="text-[11px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm ý con</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage transition */}
      <div className="flex justify-end pt-2 no-print">
        <button
          onClick={onNextStage}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5FA2] hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all"
        >
          <span>Khám phá Chặng 5: Nhật Ký Tiến Bộ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

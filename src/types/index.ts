export type SubjectType = 'Toán' | 'Tiếng Việt' | 'Khoa học' | 'Lịch sử và Địa lí' | 'Tiếng Anh';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export type UserRole = 'student' | 'teacher' | 'parent';

export interface Student {
  id: string;
  name: string;
  code: string;
  gender: 'Nam' | 'Nữ';
  avatar: string;
  points: number;
  completedMissions: string[];
  badges: string[]; // badge IDs
  preTestScore?: number; // Điểm chẩn đoán đầu vào (thang 10)
  postTestScore?: number; // Điểm kiểm tra sau can thiệp
  competencies: {
    knowledge: number; // 0 - 100
    skills: number;
    selfStudy: number;
    collaboration: number;
    confidence: number;
  };
  notes?: string;
}

export interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  subject?: SubjectType;
  level?: CognitiveLevel;
}

export interface Mission {
  id: string;
  title: string;
  subject: SubjectType;
  week: number;
  keyKnowledge: string;
  learningGoal: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  estimatedMinutes: number;
  rewardPoints: number;
  badgeRewardId?: string;
  questions: Question[];
  status?: 'locked' | 'available' | 'in_progress' | 'completed';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  unlockedAt?: string;
}

export interface ReflectionEntry {
  id: string;
  studentId: string;
  date: string;
  learned: string;
  difficulty: string;
  tomorrowGoal: string;
  mood: '😊' | '😄' | '🤔' | '💪';
  aiFeedback?: string;
}

export interface MindMapBranch {
  id: string;
  title: string;
  color: string;
  children: string[];
}

export interface MindMapData {
  id: string;
  title: string;
  central: string;
  style: 'radial' | 'tree' | 'fishbone' | 'timeline';
  branches: MindMapBranch[];
  createdAt: string;
}

export interface PeerGroup {
  id: string;
  name: string;
  members: string[]; // student names
  assignedMission: string;
  status: 'Đang thảo luận' | 'Đã hoàn thành';
  submissionNote?: string;
  rating?: number; // 1 to 5 stars
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Giáo viên hướng dẫn' | 'Học sinh thảo luận nhóm' | 'Làm nhiệm vụ trên thiết bị' | 'Trình bày sản phẩm' | 'Sơ đồ kiến thức' | 'Nhật ký tiến bộ';
  date: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
}

export interface ParentFeedback {
  id: string;
  studentId: string;
  parentName: string;
  message: string;
  date: string;
  status: 'Đã gửi' | 'Cô giáo đã đọc';
}

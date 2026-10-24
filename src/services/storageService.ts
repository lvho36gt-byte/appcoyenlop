import {
  Student,
  Mission,
  Badge,
  ReflectionEntry,
  MindMapData,
  PeerGroup,
  EvidenceItem,
  ParentFeedback,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MISSIONS,
  INITIAL_BADGES,
  INITIAL_MINDMAPS,
  INITIAL_PEER_GROUPS,
  INITIAL_EVIDENCES,
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'aimap_students_v1',
  ACTIVE_STUDENT_ID: 'aimap_active_student_id_v1',
  MISSIONS: 'aimap_missions_v1',
  BADGES: 'aimap_badges_v1',
  REFLECTIONS: 'aimap_reflections_v1',
  MINDMAPS: 'aimap_mindmaps_v1',
  PEER_GROUPS: 'aimap_peergroups_v1',
  EVIDENCES: 'aimap_evidences_v1',
  FEEDBACK: 'aimap_feedback_v1',
  USER_ROLE: 'aimap_user_role_v1',
};

export const storageService = {
  // Students
  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getActiveStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || INITIAL_STUDENTS[0].id;
  },

  setActiveStudentId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
  },

  getActiveStudent(): Student {
    const list = this.getStudents();
    const id = this.getActiveStudentId();
    return list.find((s) => s.id === id) || list[0] || INITIAL_STUDENTS[0];
  },

  updateStudent(student: Student) {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    this.saveStudents(list);
  },

  addPointsToActiveStudent(points: number): Student {
    const student = this.getActiveStudent();
    student.points = (student.points || 0) + points;
    this.updateStudent(student);
    return student;
  },

  markMissionComplete(missionId: string, bonusPoints = 10): { student: Student; newBadge?: string } {
    const student = this.getActiveStudent();
    if (!student.completedMissions.includes(missionId)) {
      student.completedMissions.push(missionId);
      student.points = (student.points || 0) + bonusPoints;
      student.competencies.knowledge = Math.min(100, student.competencies.knowledge + 2);
      student.competencies.selfStudy = Math.min(100, student.competencies.selfStudy + 3);

      // Check badge unlock
      let newBadge: string | undefined;
      if (student.completedMissions.length >= 3 && !student.badges.includes('badge-2')) {
        student.badges.push('badge-2');
        newBadge = 'Ngôi sao chăm chỉ';
      }
      this.updateStudent(student);
      return { student, newBadge };
    }
    return { student };
  },

  // Missions
  getMissions(): Mission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      return data ? JSON.parse(data) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  },

  saveMissions(missions: Mission[]) {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  },

  addMission(mission: Mission) {
    const list = this.getMissions();
    list.unshift(mission);
    this.saveMissions(list);
  },

  deleteMission(id: string) {
    const list = this.getMissions().filter((m) => m.id !== id);
    this.saveMissions(list);
  },

  // Badges
  getBadges(): Badge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BADGES);
      return data ? JSON.parse(data) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  },

  // Reflections
  getReflections(): ReflectionEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      if (data) return JSON.parse(data);
      // Demo reflection
      return [
        {
          id: 'ref-demo-1',
          studentId: 'hs-01',
          date: '2026-10-22',
          learned: 'Đã nắm vững cách quy đồng mẫu số và tính tổng hai phân số khác mẫu.',
          difficulty: 'Lúc đầu hay quên nhân cả tử số với thừa số phụ, nhưng được MapAI nhắc nhở.',
          tomorrowGoal: 'Sẽ thử sức với bài toán chuyển động đều và tạo một sơ đồ tư duy mới.',
          mood: '😄',
          aiFeedback: 'MapAI rất khâm phục sự kiên trì của Minh Khang! Nhớ được lỗi sai chính là chìa khóa để trở thành chiến binh tự học xuất sắc! ⭐',
        },
      ];
    } catch {
      return [];
    }
  },

  addReflection(entry: ReflectionEntry) {
    const list = this.getReflections();
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(list));
    // Reward student points for writing reflection
    this.addPointsToActiveStudent(5);
  },

  // Mindmaps
  getMindMaps(): MindMapData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MINDMAPS);
      return data ? JSON.parse(data) : INITIAL_MINDMAPS;
    } catch {
      return INITIAL_MINDMAPS;
    }
  },

  saveMindMaps(mindmaps: MindMapData[]) {
    localStorage.setItem(STORAGE_KEYS.MINDMAPS, JSON.stringify(mindmaps));
  },

  saveSingleMindMap(mindmap: MindMapData) {
    const list = this.getMindMaps();
    const idx = list.findIndex((m) => m.id === mindmap.id);
    if (idx >= 0) {
      list[idx] = mindmap;
    } else {
      list.unshift(mindmap);
    }
    this.saveMindMaps(list);
    this.addPointsToActiveStudent(20); // Reward for creative product
  },

  // Peer Groups
  getPeerGroups(): PeerGroup[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PEER_GROUPS);
      return data ? JSON.parse(data) : INITIAL_PEER_GROUPS;
    } catch {
      return INITIAL_PEER_GROUPS;
    }
  },

  savePeerGroups(groups: PeerGroup[]) {
    localStorage.setItem(STORAGE_KEYS.PEER_GROUPS, JSON.stringify(groups));
  },

  // Evidences
  getEvidences(): EvidenceItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVIDENCES);
      return data ? JSON.parse(data) : INITIAL_EVIDENCES;
    } catch {
      return INITIAL_EVIDENCES;
    }
  },

  saveEvidences(evidences: EvidenceItem[]) {
    localStorage.setItem(STORAGE_KEYS.EVIDENCES, JSON.stringify(evidences));
  },

  addEvidence(item: EvidenceItem) {
    const list = this.getEvidences();
    list.unshift(item);
    this.saveEvidences(list);
  },

  deleteEvidence(id: string) {
    const list = this.getEvidences().filter((e) => e.id !== id);
    this.saveEvidences(list);
  },

  // Parent Feedback
  getParentFeedback(): ParentFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      if (data) return JSON.parse(data);
      return [
        {
          id: 'fb-01',
          studentId: 'hs-01',
          parentName: 'Phụ huynh em Minh Khang',
          message: 'Gia đình rất cảm ơn cô Yến! Cháu về nhà hào hứng khoe huy hiệu mới và tự giác ngồi vào bàn học cùng robot MapAI mà không cần nhắc nhở.',
          date: '2026-10-21',
          status: 'Cô giáo đã đọc',
        },
      ];
    } catch {
      return [];
    }
  },

  addParentFeedback(fb: ParentFeedback) {
    const list = this.getParentFeedback();
    list.unshift(fb);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
  },

  // Reset demo
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
    localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MINDMAPS);
    localStorage.removeItem(STORAGE_KEYS.PEER_GROUPS);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCES);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
  },

  // Export & Import
  exportFullData(): string {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      school: 'Trường Tiểu học Khoái Châu 1',
      class: '5B',
      teacher: 'Lê Thị Yến',
      students: this.getStudents(),
      missions: this.getMissions(),
      mindmaps: this.getMindMaps(),
      reflections: this.getReflections(),
      peerGroups: this.getPeerGroups(),
      evidences: this.getEvidences(),
      feedback: this.getParentFeedback(),
    };
    return JSON.stringify(bundle, null, 2);
  },

  importFullData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.students) this.saveStudents(parsed.students);
      if (parsed.missions) this.saveMissions(parsed.missions);
      if (parsed.mindmaps) this.saveMindMaps(parsed.mindmaps);
      if (parsed.peerGroups) this.savePeerGroups(parsed.peerGroups);
      if (parsed.evidences) this.saveEvidences(parsed.evidences);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};

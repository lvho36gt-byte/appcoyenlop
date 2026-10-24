/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HelpModal } from './components/common/HelpModal';
import { HeroMap } from './components/home/HeroMap';
import { Stage1Diagnostic } from './components/stages/Stage1Diagnostic';
import { Stage2Missions } from './components/stages/Stage2Missions';
import { Stage3AITutor } from './components/stages/Stage3AITutor';
import { Stage4CreationWorkshop } from './components/stages/Stage4CreationWorkshop';
import { Stage5ProgressDiary } from './components/stages/Stage5ProgressDiary';
import { ActivitiesOverview } from './components/activities/ActivitiesOverview';
import { MissionCheckInModal } from './components/activities/MissionCheckInModal';
import { AIQuizArena } from './components/activities/AIQuizArena';
import { ProgressCardModal } from './components/activities/ProgressCardModal';
import { DigitalLibrary } from './components/library/DigitalLibrary';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentPortal } from './components/parent/ParentPortal';
import { ImpactPage } from './components/impact/ImpactPage';
import { EvidenceGallery } from './components/evidence/EvidenceGallery';
import { TeacherProfile } from './components/teacher/TeacherProfile';

import { Student, Mission, UserRole } from './types';
import { storageService } from './services/storageService';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentTab, setCurrentTab] = useState<string>('map');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Data states
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [activeStudent, setActiveStudent] = useState<Student>(() => storageService.getActiveStudent());
  const [missions, setMissions] = useState<Mission[]>(() => storageService.getMissions());

  // Interactive Modals
  const [helpOpen, setHelpOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [progressCardOpen, setProgressCardOpen] = useState(false);

  const refreshStudentState = () => {
    const updatedList = storageService.getStudents();
    setStudents(updatedList);
    setActiveStudent(storageService.getActiveStudent());
  };

  const handleSelectStudent = (id: string) => {
    storageService.setActiveStudentId(id);
    setActiveStudent(storageService.getActiveStudent());
  };

  const handleResetData = () => {
    if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của Lớp 5B?')) {
      storageService.resetToDefault();
      setStudents(storageService.getStudents());
      setActiveStudent(storageService.getActiveStudent());
      setMissions(storageService.getMissions());
      alert('Đã khôi phục dữ liệu mẫu thành công!');
    }
  };

  const handleSelectStage = (stageId: number) => {
    switch (stageId) {
      case 1:
        setCurrentTab('stage1');
        break;
      case 2:
        setCurrentTab('stage2');
        break;
      case 3:
        setCurrentTab('stage3');
        break;
      case 4:
        setCurrentTab('stage4');
        break;
      case 5:
        setCurrentTab('stage5');
        break;
      default:
        setCurrentTab('map');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FBFF] selection:bg-blue-200">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeStudent={activeStudent}
        allStudents={students}
        onSelectStudent={handleSelectStudent}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenHelp={() => setHelpOpen(true)}
        onResetData={handleResetData}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB: MAP (Home view) */}
        {currentTab === 'map' && (
          <HeroMap
            activeStudent={activeStudent}
            onSelectStage={handleSelectStage}
            onOpenCheckIn={() => setCheckInOpen(true)}
            onOpenQuiz={() => setQuizOpen(true)}
            onOpenProgressCard={() => setProgressCardOpen(true)}
            onNavigateTab={setCurrentTab}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: STAGE 1 (Chẩn đoán đầu vào) */}
        {currentTab === 'stage1' && (
          <Stage1Diagnostic
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onBackToMap={() => setCurrentTab('map')}
            onNextStage={() => setCurrentTab('stage2')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: STAGE 2 (Nhiệm vụ theo chặng) */}
        {currentTab === 'stage2' && (
          <Stage2Missions
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onBackToMap={() => setCurrentTab('map')}
            onNextStage={() => setCurrentTab('stage3')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: STAGE 3 (MapAI Bạn học tập) */}
        {currentTab === 'stage3' && (
          <Stage3AITutor
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onBackToMap={() => setCurrentTab('map')}
            onNextStage={() => setCurrentTab('stage4')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: STAGE 4 (Xưởng sáng tạo AI & Sơ đồ tư duy) */}
        {currentTab === 'stage4' && (
          <Stage4CreationWorkshop
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onBackToMap={() => setCurrentTab('map')}
            onNextStage={() => setCurrentTab('stage5')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: STAGE 5 (Nhật ký tiến bộ & Tự đánh giá) */}
        {currentTab === 'stage5' && (
          <Stage5ProgressDiary
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onBackToMap={() => setCurrentTab('map')}
            onOpenProgressCard={() => setProgressCardOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: 6 ACTIVITIES OVERVIEW */}
        {currentTab === 'activities' && (
          <ActivitiesOverview
            activeStudent={activeStudent}
            onStudentUpdated={refreshStudentState}
            onOpenCheckIn={() => setCheckInOpen(true)}
            onOpenQuiz={() => setQuizOpen(true)}
            onOpenProgressCard={() => setProgressCardOpen(true)}
            onOpenMindMap={() => setCurrentTab('stage4')}
            onOpenReflectionDiary={() => setCurrentTab('stage5')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: DIGITAL LIBRARY */}
        {currentTab === 'library' && <DigitalLibrary />}

        {/* TAB: TEACHER DASHBOARD */}
        {currentTab === 'teacher-dashboard' && (
          <TeacherDashboard
            students={students}
            onStudentsUpdated={refreshStudentState}
            missions={missions}
            onMissionsUpdated={() => setMissions(storageService.getMissions())}
            soundEnabled={soundEnabled}
          />
        )}

        {/* TAB: PARENT PORTAL */}
        {currentTab === 'parent-portal' && (
          <ParentPortal
            activeStudent={activeStudent}
            onOpenProgressCard={() => setProgressCardOpen(true)}
          />
        )}

        {/* TAB: IMPACT */}
        {currentTab === 'impact' && <ImpactPage />}

        {/* TAB: EVIDENCE */}
        {currentTab === 'evidence' && <EvidenceGallery />}

        {/* TAB: TEACHER PROFILE */}
        {currentTab === 'teacher-profile' && (
          <TeacherProfile onBackToMap={() => setCurrentTab('map')} />
        )}
      </main>

      {/* Global Interactive Modals */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <MissionCheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        activeStudent={activeStudent}
        onStudentUpdated={refreshStudentState}
        soundEnabled={soundEnabled}
      />

      <AIQuizArena
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        soundEnabled={soundEnabled}
        onStudentUpdated={refreshStudentState}
      />

      <ProgressCardModal
        isOpen={progressCardOpen}
        onClose={() => setProgressCardOpen(false)}
        activeStudent={activeStudent}
      />

      {/* Footer */}
      <Footer
        onOpenTeacherProfile={() => setCurrentTab('teacher-profile')}
        onOpenHelp={() => setHelpOpen(true)}
      />
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { ViolationRecord, StudentData, Gender } from '../types.ts';
import { INITIAL_VIOLATIONS, INITIAL_STUDENT_DATA } from '../constants.ts';
import ViolationList from './ViolationList.tsx';
import ViolationFormModal from './ViolationFormModal.tsx';
import AnalysisModal from './AnalysisModal.tsx';
import { analyzeViolations } from '../services/geminiService.ts';
import { printAnalysisReport } from '../services/printService.ts';
import ViolationChart from './ViolationChart.tsx';
import StudentManagementModal from './StudentManagementModal.tsx';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [violations, setViolations] = useState<ViolationRecord[]>(INITIAL_VIOLATIONS);
  const [students, setStudents] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<ViolationRecord | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    setEditingViolation(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (violation: ViolationRecord) => {
    setEditingViolation(violation);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      setViolations(violations.filter((v) => v.id !== id));
    }
  };

  const handleSaveViolation = (violation: ViolationRecord) => {
    if (editingViolation) {
      setViolations(violations.map((v) => (v.id === violation.id ? violation : v)));
    } else {
      setViolations([...violations, { ...violation, id: new Date().toISOString() }]);
    }
    setIsFormOpen(false);
    setEditingViolation(null);
  };
  
  const handleAnalyze = async () => {
    setIsAnalysisOpen(true);
    setIsAnalyzing(true);
    const result = await analyzeViolations(violations);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handlePrintClick = async () => {
    setIsPrinting(true);
    const result = await analyzeViolations(violations);
    setIsPrinting(false); // Stop loading once analysis is complete

    if (result && !result.startsWith("Error:")) {
        const teacherName = window.prompt("Masukkan nama guru piket untuk laporan:", "");
        if (teacherName && teacherName.trim() !== "") {
            printAnalysisReport(result, teacherName.trim(), violations);
        }
    } else {
        alert(result || "Gagal menghasilkan analisis untuk dicetak.");
    }
  };

  const handleAddStudent = (className: string, studentName: string, gender: Gender) => {
    setStudents(prevStudents => {
      const newStudents = { ...prevStudents };
      const classStudents = newStudents[className] || [];
      if (!classStudents.find(s => s.name.toLowerCase() === studentName.toLowerCase())) {
        newStudents[className] = [...classStudents, { name: studentName, gender }].sort((a, b) => a.name.localeCompare(b.name));
      }
      return newStudents;
    });
  };

  const handleDeleteStudent = (className: string, studentName: string) => {
     if (window.confirm(`Apakah Anda yakin ingin menghapus siswa ${studentName} dari kelas ${className}?`)) {
        setStudents(prevStudents => {
            const newStudents = { ...prevStudents };
            if (newStudents[className]) {
                newStudents[className] = newStudents[className].filter(s => s.name !== studentName);
                if (newStudents[className].length === 0) {
                    delete newStudents[className];
                }
            }
            return newStudents;
        });
     }
  };

  const filteredViolations = useMemo(() => {
    return violations.filter(v => 
        v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [violations, searchTerm]);

  return (
    <>
      <header className="bg-white shadow-md dark:bg-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Pelanggaran</h1>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Analisis Siswa Pelanggar Teratas</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isPrinting}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                  >
                    {isAnalyzing ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    )}
                    Analisis dengan AI
                  </button>
                  <button
                    onClick={handlePrintClick}
                    disabled={isPrinting || isAnalyzing}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                     {isPrinting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                    )}
                    Cetak Laporan AI
                  </button>
                </div>
              </div>
               <ViolationChart data={violations} />
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                     <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Daftar Pelanggaran</h2>
                        <button onClick={() => setIsStudentModalOpen(true)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                          Kelola Data Siswa
                        </button>
                    </div>
                     <div className="relative w-full sm:w-64">
                         <input
                            type="text"
                            placeholder="Cari nama atau kelas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
              <ViolationList
                violations={filteredViolations}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        </div>
      </main>

      {isFormOpen && (
        <ViolationFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingViolation(null);
          }}
          onSave={handleSaveViolation}
          violation={editingViolation}
          students={students}
        />
      )}
      
      {isStudentModalOpen && (
        <StudentManagementModal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          students={students}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {isAnalysisOpen && (
        <AnalysisModal
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          analysisResult={analysisResult}
          isLoading={isAnalyzing}
        />
      )}

      <button
        onClick={handleAddClick}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Tambah Pelanggaran"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </>
  );
};

export default Dashboard;
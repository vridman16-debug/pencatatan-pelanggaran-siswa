import React, { useState } from 'react';
import { StudentData, Gender, Student } from '../types.ts';

interface StudentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentData;
  onAddStudent: (className: string, studentName: string, gender: Gender) => void;
  onDeleteStudent: (className: string, studentName: string) => void;
}

const StudentManagementModal: React.FC<StudentManagementModalProps> = ({
  isOpen,
  onClose,
  students,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<Gender>(Gender.MALE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && newStudentClass.trim()) {
      onAddStudent(newStudentClass.trim().toUpperCase(), newStudentName.trim(), newStudentGender);
      setNewStudentName('');
      setNewStudentClass('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Data Siswa</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Tambah Siswa Baru</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newStudentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input type="text" id="newStudentName" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="newStudentClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                <input type="text" id="newStudentClass" value={newStudentClass} onChange={(e) => setNewStudentClass(e.target.value)} required placeholder="Contoh: X-A" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="sm:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                 <div className="mt-2 flex gap-4">
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-indigo-600" name="gender" value={Gender.MALE} checked={newStudentGender === Gender.MALE} onChange={() => setNewStudentGender(Gender.MALE)} />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">{Gender.MALE}</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-pink-600" name="gender" value={Gender.FEMALE} checked={newStudentGender === Gender.FEMALE} onChange={() => setNewStudentGender(Gender.FEMALE)} />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">{Gender.FEMALE}</span>
                    </label>
                 </div>
              </div>
            </div>
            <div className="text-right mt-4">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Tambah Siswa</button>
            </div>
          </form>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Daftar Siswa Terdaftar</h3>
           <div className="space-y-4">
             {Object.keys(students).sort().map(className => (
                <div key={className}>
                    <h4 className="font-bold text-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-t-md">{className}</h4>
                    <ul className="border dark:border-gray-600 rounded-b-md">
                        {students[className].map(student => (
                            <li key={student.name} className="flex justify-between items-center p-3 border-b dark:border-gray-600 last:border-b-0">
                                <span className="text-gray-800 dark:text-gray-200">{student.name} <span className="text-xs text-gray-500">({student.gender})</span></span>
                                <button onClick={() => onDeleteStudent(className, student.name)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
             ))}
             {Object.keys(students).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data siswa.</p>
             )}
           </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-right">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentManagementModal;
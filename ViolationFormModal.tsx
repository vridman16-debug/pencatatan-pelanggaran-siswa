import React, { useState, useEffect } from 'react';
import { ViolationRecord, ViolationType, Gender, StudentData } from '../types.ts';

interface ViolationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (violation: ViolationRecord) => void;
  violation: ViolationRecord | null;
  students: StudentData;
}

const ViolationFormModal: React.FC<ViolationFormModalProps> = ({ isOpen, onClose, onSave, violation, students }) => {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableStudents, setAvailableStudents] = useState<{ name: string; gender: Gender }[]>([]);
  const [violations, setViolations] = useState<ViolationType[]>([]);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
      setStudentName('');
      setStudentClass('');
      setGender(null);
      setAvailableStudents([]);
      setViolations([]);
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
  };
  
  useEffect(() => {
    if (isOpen) {
        if (violation) {
            const studentsInClass = students[violation.studentClass] || [];
            setStudentClass(violation.studentClass);
            setAvailableStudents(studentsInClass);
            setStudentName(violation.studentName);
            setGender(violation.gender);
            setViolations(violation.violations);
            setNotes(violation.notes || '');
            setDate(violation.date);
        } else {
            resetForm();
        }
    }
  }, [violation, isOpen, students]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = e.target.value;
    setStudentClass(selectedClass);
    setStudentName('');
    setGender(null);
    setAvailableStudents(students[selectedClass] || []);
  };
  
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedStudentName = e.target.value;
      const student = availableStudents.find(s => s.name === selectedStudentName);
      setStudentName(selectedStudentName);
      if (student) {
          setGender(student.gender);
      }
  };

  const handleViolationChange = (type: ViolationType) => {
    setViolations((prev) =>
      prev.includes(type) ? prev.filter((v) => v !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && studentClass && gender && violations.length > 0 && date) {
      onSave({
        id: violation?.id || '',
        studentName,
        studentClass,
        gender,
        violations,
        notes,
        date,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{violation ? 'Edit' : 'Tambah'} Pelanggaran</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                    <select id="studentClass" value={studentClass} onChange={handleClassChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Pilih Kelas</option>
                        {Object.keys(students).sort().map(className => (
                            <option key={className} value={className}>{className}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Siswa</label>
                    <select id="studentName" value={studentName} onChange={handleStudentChange} required disabled={!studentClass} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Pilih Siswa</option>
                        {availableStudents.map(student => (
                            <option key={student.name} value={student.name}>{student.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Pelanggaran</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                    <input type="text" value={gender || 'Otomatis terisi'} readOnly disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 sm:text-sm" />
                 </div>
             </div>
             
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Pelanggaran</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(ViolationType).map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={type}
                      type="checkbox"
                      checked={violations.includes(type)}
                      onChange={() => handleViolationChange(type)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={type} className="ml-3 block text-sm text-gray-900 dark:text-gray-200">{type}</label>
                  </div>
                ))}
              </div>
            </div>
             <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan (Opsional)</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViolationFormModal;
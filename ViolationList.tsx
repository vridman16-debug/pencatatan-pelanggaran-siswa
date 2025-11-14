import React from 'react';
import { ViolationRecord, Gender } from '../types.ts';

interface ViolationListProps {
  violations: ViolationRecord[];
  onEdit: (violation: ViolationRecord) => void;
  onDelete: (id: string) => void;
}

const GenderIcon: React.FC<{ gender: Gender }> = ({ gender }) => {
  if (gender === Gender.MALE) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-label="Laki-laki">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor" aria-label="Perempuan">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );
};


const ViolationItem: React.FC<{ violation: ViolationRecord; onEdit: () => void; onDelete: () => void }> = ({ violation, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-2">
             <GenderIcon gender={violation.gender} />
             <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{violation.studentName}</p>
           </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 ml-7">{violation.studentClass} - {new Date(violation.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Pelanggaran:</p>
        <ul className="list-disc list-inside mt-1 flex flex-wrap gap-2">
          {violation.violations.map((v) => (
            <li key={v} className="text-sm text-gray-600 dark:text-gray-300 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full">{v}</li>
          ))}
        </ul>
        {violation.notes && <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic">Catatan: {violation.notes}</p>}
      </div>
    </div>
  );
};


const ViolationList: React.FC<ViolationListProps> = ({ violations, onEdit, onDelete }) => {
  if (violations.length === 0) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Tidak ada data pelanggaran</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Belum ada catatan pelanggaran yang ditemukan.</p>
    </div>;
  }
  
  return (
    <div className="space-y-4">
      {violations.map((v) => (
        <ViolationItem key={v.id} violation={v} onEdit={() => onEdit(v)} onDelete={() => onDelete(v.id)} />
      ))}
    </div>
  );
};

export default ViolationList;
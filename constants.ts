import { ViolationType, ViolationRecord, Gender, StudentData } from './types.ts';

export const MOCK_CREDENTIALS = {
  username: 'gurupiket',
  password: 'password123',
};

export const INITIAL_STUDENT_DATA: StudentData = {
  'X-A': [
    { name: 'Doni Firmansyah', gender: Gender.MALE },
    { name: 'Farah Nabila', gender: Gender.FEMALE },
  ],
  'X-C': [
    { name: 'Agus Wijaya', gender: Gender.MALE },
    { name: 'Gita Amelia', gender: Gender.FEMALE },
  ],
  'XI IPS 2': [
    { name: 'Citra Lestari', gender: Gender.FEMALE },
    { name: 'Hadi Prasetyo', gender: Gender.MALE },
  ],
  'XII IPA 1': [
    { name: 'Budi Santoso', gender: Gender.MALE },
    { name: 'Bambang Yudhoyono', gender: Gender.MALE },
    { name: 'Rina Hartati', gender: Gender.FEMALE },
  ],
  'XII Bahasa': [
    { name: 'Eka Putri', gender: Gender.FEMALE },
    { name: 'Indra Gunawan', gender: Gender.MALE },
  ],
};


export const INITIAL_VIOLATIONS: ViolationRecord[] = [
  {
    id: '1',
    studentName: 'Budi Santoso',
    studentClass: 'XII IPA 1',
    gender: Gender.MALE,
    date: '2024-07-15',
    violations: [ViolationType.NO_HAT, ViolationType.IMPROPER_SHOES],
    notes: 'Sepatu berwarna-warni.'
  },
  {
    id: '2',
    studentName: 'Citra Lestari',
    studentClass: 'XI IPS 2',
    gender: Gender.FEMALE,
    date: '2024-07-15',
    violations: [ViolationType.NO_TIE],
  },
  {
    id: '3',
    studentName: 'Doni Firmansyah',
    studentClass: 'X-A',
    gender: Gender.MALE,
    date: '2024-07-22',
    violations: [ViolationType.LONG_HAIR, ViolationType.IMPROPER_SOCKS],
    notes: 'Rambut menutupi telinga.'
  },
  {
    id: '4',
    studentName: 'Eka Putri',
    studentClass: 'XII Bahasa',
    gender: Gender.FEMALE,
    date: '2024-07-22',
    violations: [ViolationType.INCOMPLETE_BADGE],
  },
   {
    id: '5',
    studentName: 'Agus Wijaya',
    studentClass: 'X-C',
    gender: Gender.MALE,
    date: '2024-07-29',
    violations: [ViolationType.NO_HAT],
  },
  {
    id: '6',
    studentName: 'Bambang Yudhoyono',
    studentClass: 'XII IPA 1',
    gender: Gender.MALE,
    date: '2024-07-29',
    violations: [ViolationType.LONG_HAIR],
  }
];
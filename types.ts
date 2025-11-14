export enum ViolationType {
  NO_HAT = "Tidak Memakai Topi",
  IMPROPER_SHOES = "Sepatu Tidak Sesuai",
  NO_TIE = "Tidak Memakai Dasi",
  LONG_HAIR = "Rambut Panjang (Putra)",
  IMPROPER_SOCKS = "Kaus Kaki Tidak Sesuai",
  INCOMPLETE_BADGE = "Badge/Atribut Tidak Lengkap",
  OTHER = "Lainnya",
}

export enum Gender {
  MALE = "Laki-laki",
  FEMALE = "Perempuan",
}

export interface Student {
  name: string;
  gender: Gender;
}

export interface StudentData {
  [className: string]: Student[];
}

export interface ViolationRecord {
  id: string;
  studentName: string;
  studentClass: string;
  gender: Gender;
  date: string;
  violations: ViolationType[];
  notes?: string;
}
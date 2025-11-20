export type UserRole = "alumni" | "admin" | "company";

export type WorkStatus = "siap_bekerja" | "mencari_peluang" | "melanjutkan_pendidikan" | "belum_siap";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  graduationYear?: number;
  major: string;
  bio?: string;
  avatar?: string;
  workStatus: WorkStatus;
  technicalSkills: string[];
  softSkills: string[];
  profileCompletion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  alumniId: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: "cv" | "sertifikat" | "portofolio" | "surat_rekomendasi";
  uploadedAt: Date;
}

export interface Activity {
  id: string;
  alumniId: string;
  type: "profile_update" | "document_upload" | "application" | "view";
  description: string;
  timestamp: Date;
}

export interface JobListing {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  salary?: string;
  location: string;
  postingDate: Date;
  deadline: Date;
}

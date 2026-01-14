
export enum Role {
  ADMIN = 'ADMIN',
  COLABORADOR = 'COLABORADOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string; // Campo opcional para armazenar a senha de acesso
}

export interface Category {
  id: string;
  name: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  category: string;
  isNew: boolean;
  createdAt: string;
  quizId?: string;
}

export interface Pdf {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  isNew: boolean;
  createdAt: string;
  thumbnail?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  videoId?: string;
  passingScore: number;
  questions: Question[];
}

export interface VideoProgress {
  videoId: string;
  watchedTime: number;
  completed: boolean;
  lastWatched: string;
}

export interface PdfProgress {
  pdfId: string;
  opened: boolean;
  completed: boolean;
  lastOpened: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

export interface ProgressState {
  videos: Record<string, VideoProgress>;
  pdfs: Record<string, PdfProgress>;
  quizzes: QuizAttempt[];
}

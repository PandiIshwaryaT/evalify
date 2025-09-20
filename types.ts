export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E' | '';

export interface AnswerKey {
  [key: number]: AnswerOption;
}

export interface DetectedAnswers {
  [key: number]: AnswerOption;
}

export interface SubjectScores {
  [key: string]: {
    score: number;
    total: number;
  };
}

export interface OMRResult {
  id: string;
  evaluationName?: string;
  imageFileName: string;
  evaluationDate: string;
  totalScore: number;
  subjectScores: SubjectScores;
  detectedAnswers: DetectedAnswers;
  answerKeyId: string;
}

export interface User {
  email: string;
  name?: string;
  profilePicture?: string;
  phone?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}
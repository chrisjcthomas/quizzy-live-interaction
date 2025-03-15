
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
  timeLimit?: number; // in seconds
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
}

export interface QuizSession {
  id: string;
  code: string;
  quizId: string;
  status: 'waiting' | 'active' | 'completed';
  currentQuestionIndex: number;
  startedAt: string;
  endedAt?: string;
}

export interface StudentResponse {
  sessionId: string;
  questionId: string;
  studentId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
}

export interface QuizResults {
  sessionId: string;
  totalStudents: number;
  questionResults: {
    questionId: string;
    correctResponses: number;
    incorrectResponses: number;
    averageResponseTime: number;
    optionDistribution: Record<string, number>;
  }[];
  studentResults: {
    studentId: string;
    name: string;
    score: number;
    totalCorrect: number;
    averageResponseTime: number;
  }[];
}

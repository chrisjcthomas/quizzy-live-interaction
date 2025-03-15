
import { Quiz, QuizQuestion, QuizSession, StudentResponse, QuizResults } from "@/types/quiz";

// Utility to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Generate a random 6-character session code
export const generateSessionCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Mock quizzes data
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "Introduction to React",
    description: "Test your knowledge of React fundamentals",
    questions: [
      {
        id: "q1",
        text: "What is React?",
        options: [
          { id: "o1", text: "A JavaScript library for building user interfaces" },
          { id: "o2", text: "A programming language" },
          { id: "o3", text: "A database management system" },
          { id: "o4", text: "A design software" }
        ],
        correctOptionId: "o1",
        timeLimit: 30
      },
      {
        id: "q2",
        text: "What is JSX?",
        options: [
          { id: "o1", text: "A JavaScript extension for SQL" },
          { id: "o2", text: "A syntax extension for JavaScript recommended for React" },
          { id: "o3", text: "A new programming language" },
          { id: "o4", text: "JavaScript XML" }
        ],
        correctOptionId: "o2",
        timeLimit: 30
      },
      {
        id: "q3",
        text: "Which of the following is used to pass data to a component in React?",
        options: [
          { id: "o1", text: "setState" },
          { id: "o2", text: "render" },
          { id: "o3", text: "props" },
          { id: "o4", text: "propTypes" }
        ],
        correctOptionId: "o3",
        timeLimit: 20
      }
    ],
    createdBy: "teacher1",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
  },
  {
    id: "quiz2",
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    questions: [
      {
        id: "q1",
        text: "Which of the following is NOT a JavaScript data type?",
        options: [
          { id: "o1", text: "String" },
          { id: "o2", text: "Boolean" },
          { id: "o3", text: "Character" },
          { id: "o4", text: "Number" }
        ],
        correctOptionId: "o3",
        timeLimit: 20
      },
      {
        id: "q2",
        text: "What will be the output of: console.log(typeof [])?",
        options: [
          { id: "o1", text: "array" },
          { id: "o2", text: "object" },
          { id: "o3", text: "undefined" },
          { id: "o4", text: "null" }
        ],
        correctOptionId: "o2",
        timeLimit: 25
      }
    ],
    createdBy: "teacher1",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  }
];

// Mock sessions data
export const mockSessions: QuizSession[] = [
  {
    id: "session1",
    code: "ABC123",
    quizId: "quiz1",
    status: "completed",
    currentQuestionIndex: 3, // All questions completed
    startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endedAt: new Date(Date.now() - 3000000).toISOString() // 50 minutes ago
  }
];

// Mock student responses
export const mockStudentResponses: StudentResponse[] = [
  {
    sessionId: "session1",
    questionId: "q1",
    studentId: "student1",
    selectedOptionId: "o1",
    isCorrect: true,
    responseTime: 15000 // 15 seconds
  },
  {
    sessionId: "session1",
    questionId: "q1",
    studentId: "student2",
    selectedOptionId: "o2",
    isCorrect: false,
    responseTime: 12000 // 12 seconds
  }
];

// Mock results
export const mockResults: QuizResults = {
  sessionId: "session1",
  totalStudents: 20,
  questionResults: [
    {
      questionId: "q1",
      correctResponses: 15,
      incorrectResponses: 5,
      averageResponseTime: 18500,
      optionDistribution: {
        "o1": 15, // Correct option
        "o2": 2,
        "o3": 1,
        "o4": 2
      }
    },
    {
      questionId: "q2",
      correctResponses: 12,
      incorrectResponses: 8,
      averageResponseTime: 22000,
      optionDistribution: {
        "o1": 3,
        "o2": 12, // Correct option
        "o3": 3,
        "o4": 2
      }
    }
  ],
  studentResults: [
    {
      studentId: "student1",
      name: "John Doe",
      score: 2, // 2 correct answers out of 2
      totalCorrect: 2,
      averageResponseTime: 17500
    },
    {
      studentId: "student2",
      name: "Jane Smith",
      score: 1, // 1 correct answer out of 2
      totalCorrect: 1,
      averageResponseTime: 19200
    }
  ]
};

// Mock user data
export const mockUsers = {
  teachers: [
    { id: "teacher1", name: "Professor Smith", email: "smith@example.com" }
  ],
  students: [
    { id: "student1", name: "John Doe", email: "john@example.com" },
    { id: "student2", name: "Jane Smith", email: "jane@example.com" }
  ]
};

// Mock service for teacher operations
export const teacherService = {
  getQuizzes: () => Promise.resolve(mockQuizzes),
  
  getQuizById: (id: string) => {
    const quiz = mockQuizzes.find(q => q.id === id);
    return Promise.resolve(quiz);
  },
  
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newQuiz);
  },
  
  createSession: (quizId: string) => {
    const session: QuizSession = {
      id: generateId(),
      code: generateSessionCode(),
      quizId,
      status: 'waiting',
      currentQuestionIndex: 0,
      startedAt: new Date().toISOString()
    };
    return Promise.resolve(session);
  },
  
  startSession: (sessionId: string) => {
    return Promise.resolve({ success: true });
  },
  
  nextQuestion: (sessionId: string) => {
    return Promise.resolve({ success: true });
  },
  
  endSession: (sessionId: string) => {
    return Promise.resolve({ success: true });
  },
  
  getSessionResults: (sessionId: string) => {
    return Promise.resolve(mockResults);
  }
};

// Mock service for student operations
export const studentService = {
  joinSession: (code: string, name: string) => {
    // In real app, this would validate the code and register the student
    const session = mockSessions.find(s => s.code === code);
    if (!session) {
      return Promise.reject(new Error("Invalid session code"));
    }
    
    return Promise.resolve({
      sessionId: session.id,
      studentId: generateId(),
      name
    });
  },
  
  submitAnswer: (answer: Omit<StudentResponse, 'isCorrect' | 'responseTime'>) => {
    // In real app, this would validate the answer and calculate if correct
    return Promise.resolve({
      success: true,
      isCorrect: Math.random() > 0.5
    });
  },
  
  getCurrentQuestion: (sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session) {
      return Promise.reject(new Error("Session not found"));
    }
    
    const quiz = mockQuizzes.find(q => q.id === session.quizId);
    if (!quiz) {
      return Promise.reject(new Error("Quiz not found"));
    }
    
    return Promise.resolve(quiz.questions[session.currentQuestionIndex]);
  }
};

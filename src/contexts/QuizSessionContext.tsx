
import React, { createContext, useState, useContext, useEffect } from "react";
import { QuizQuestion, StudentResponse } from "@/types/quiz";
import { studentService, teacherService } from "@/services/mockData";

interface SessionContextType {
  // Session data
  sessionId: string | null;
  sessionCode: string | null;
  currentQuestion: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number | null;
  showResults: boolean;
  
  // Student data
  studentId: string | null;
  selectedOption: string | null;
  isAnswerCorrect: boolean | null;
  
  // Functions for teachers
  startSession: (quizId: string) => Promise<string>; // Returns session code
  advanceToNextQuestion: () => Promise<boolean>;
  endSession: () => Promise<void>;
  
  // Functions for students
  joinSession: (code: string, name: string) => Promise<void>;
  submitAnswer: (optionId: string) => Promise<boolean>;
  
  // Shared functions
  leaveSession: () => void;
}

const QuizSessionContext = createContext<SessionContextType | undefined>(undefined);

export const QuizSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Timer effect for questions
  useEffect(() => {
    if (currentQuestion?.timeLimit && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentQuestion, timeRemaining]);

  // Teacher functions
  const startSession = async (quizId: string) => {
    try {
      const session = await teacherService.createSession(quizId);
      const quiz = await teacherService.getQuizById(quizId);
      
      setSessionId(session.id);
      setSessionCode(session.code);
      setQuestionIndex(0);
      setTotalQuestions(quiz?.questions.length || 0);
      setCurrentQuestion(quiz?.questions[0] || null);
      setTimeRemaining(quiz?.questions[0]?.timeLimit || null);
      setShowResults(false);
      
      return session.code;
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    }
  };

  const advanceToNextQuestion = async () => {
    try {
      if (!sessionId) return false;
      
      // In real app, sync with server
      await teacherService.nextQuestion(sessionId);
      
      const quiz = await teacherService.getQuizById("quiz1"); // Mock ID
      const nextIndex = questionIndex + 1;
      
      if (nextIndex >= (quiz?.questions.length || 0)) {
        setShowResults(true);
        return false;
      }
      
      setQuestionIndex(nextIndex);
      setCurrentQuestion(quiz?.questions[nextIndex] || null);
      setTimeRemaining(quiz?.questions[nextIndex]?.timeLimit || null);
      return true;
    } catch (error) {
      console.error("Failed to advance question:", error);
      return false;
    }
  };

  const endSession = async () => {
    try {
      if (!sessionId) return;
      
      await teacherService.endSession(sessionId);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  // Student functions
  const joinSession = async (code: string, name: string) => {
    try {
      const result = await studentService.joinSession(code, name);
      
      setSessionId(result.sessionId);
      setSessionCode(code);
      setStudentId(result.studentId);
      
      // Get current question
      const question = await studentService.getCurrentQuestion(result.sessionId);
      setCurrentQuestion(question);
      setTimeRemaining(question?.timeLimit || null);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      
      return;
    } catch (error) {
      console.error("Failed to join session:", error);
      throw error;
    }
  };

  const submitAnswer = async (optionId: string) => {
    try {
      if (!sessionId || !studentId || !currentQuestion) return false;
      
      setSelectedOption(optionId);
      
      const answer: Omit<StudentResponse, 'isCorrect' | 'responseTime'> = {
        sessionId,
        questionId: currentQuestion.id,
        studentId,
        selectedOptionId: optionId
      };
      
      const result = await studentService.submitAnswer(answer);
      setIsAnswerCorrect(result.isCorrect);
      
      return result.isCorrect;
    } catch (error) {
      console.error("Failed to submit answer:", error);
      return false;
    }
  };

  // Shared functions
  const leaveSession = () => {
    setSessionId(null);
    setSessionCode(null);
    setStudentId(null);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setTimeRemaining(null);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowResults(false);
  };

  return (
    <QuizSessionContext.Provider value={{
      sessionId,
      sessionCode,
      currentQuestion,
      questionIndex,
      totalQuestions,
      timeRemaining,
      showResults,
      
      studentId,
      selectedOption,
      isAnswerCorrect,
      
      startSession,
      advanceToNextQuestion,
      endSession,
      
      joinSession,
      submitAnswer,
      
      leaveSession
    }}>
      {children}
    </QuizSessionContext.Provider>
  );
};

export const useQuizSession = () => {
  const context = useContext(QuizSessionContext);
  if (context === undefined) {
    throw new Error("useQuizSession must be used within a QuizSessionProvider");
  }
  return context;
};

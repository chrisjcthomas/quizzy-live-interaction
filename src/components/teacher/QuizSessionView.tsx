import React, { useState, useEffect } from "react";
import { useQuizSession } from "@/contexts/QuizSessionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Play, AlertCircle, Users, ChevronRight, Clock, BarChart, Check } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const QuizSessionView: React.FC<{ 
  quizId: string;
  onEndSession?: (sessionId: string | null) => void;
}> = ({ 
  quizId, 
  onEndSession 
}) => {
  const { 
    startSession, 
    sessionCode, 
    currentQuestion, 
    questionIndex, 
    totalQuestions, 
    timeRemaining, 
    advanceToNextQuestion, 
    endSession, 
    showResults 
  } = useQuizSession();
  
  const { toast } = useToast();
  
  const [sessionState, setSessionState] = useState<'waiting' | 'question' | 'results'>('waiting');
  const [studentCount, setStudentCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [responseData, setResponseData] = useState<any[]>([]);
  
  const mockResults = [
    { name: 'Correct', value: 15, color: '#22C55E' },
    { name: 'Incorrect', value: 5, color: '#EF4444' }
  ];

  useEffect(() => {
    if (sessionState === 'question' && timeRemaining === 0) {
      setShowAnswer(true);
    }
  }, [timeRemaining, sessionState]);

  useEffect(() => {
    if (showResults) {
      setSessionState('results');
    }
  }, [showResults]);

  useEffect(() => {
    if (sessionState === 'waiting' && sessionCode) {
      const interval = setInterval(() => {
        setStudentCount(prev => {
          if (prev < 20 && Math.random() > 0.5) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [sessionState, sessionCode]);

  useEffect(() => {
    if (currentQuestion && sessionState === 'question') {
      const initialData = currentQuestion.options.map(option => ({
        name: option.text,
        id: option.id,
        value: 0,
        color: option.id === currentQuestion.correctOptionId ? '#22C55E' : '#94A3B8'
      }));
      
      setResponseData(initialData);
      setShowAnswer(false);
      
      const interval = setInterval(() => {
        setResponseData(prev => {
          return prev.map(item => {
            if (Math.random() > 0.7) {
              return {
                ...item,
                value: item.value + 1
              };
            }
            return item;
          });
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentQuestion, questionIndex, sessionState]);

  const handleStartSession = async () => {
    try {
      const code = await startSession(quizId);
      toast({
        title: "Session started",
        description: `Share code ${code} with your students`
      });
      setSessionState('waiting');
    } catch (error) {
      toast({
        title: "Failed to start session",
        description: "An error occurred while starting the session",
        variant: "destructive"
      });
    }
  };

  const handleStartQuiz = () => {
    if (studentCount === 0) {
      toast({
        title: "No students joined",
        description: "Wait for students to join before starting the quiz",
        variant: "destructive"
      });
      return;
    }
    
    setSessionState('question');
  };

  const handleNextQuestion = async () => {
    const success = await advanceToNextQuestion();
    if (!success) {
      await endSession();
      setSessionState('results');
    } else {
      setShowAnswer(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleEndSession = async () => {
    await endSession();
    
    if (onEndSession) {
      onEndSession(sessionCode || "session-123");
    }
  };

  const renderSessionState = () => {
    switch (sessionState) {
      case 'waiting':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 py-12">
            <div className="bg-muted p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Session Code</h3>
              <p className="session-code mb-2">{sessionCode}</p>
              <p className="text-muted-foreground">Share this code with your students</p>
            </div>
            
            <div className="flex items-center space-x-2 text-xl">
              <Users className="h-6 w-6 text-quiz-primary" />
              <span>{studentCount} students joined</span>
            </div>
            
            <Button 
              onClick={handleStartQuiz} 
              className="bg-quiz-primary hover:bg-quiz-primary/90 text-lg py-6 px-8"
              disabled={studentCount === 0}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </div>
        );
        
      case 'question':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Question {questionIndex + 1} of {totalQuestions}
              </h3>
              
              {timeRemaining !== null && (
                <div className="timer-circle">
                  {timeRemaining}
                </div>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{currentQuestion?.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion?.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`quiz-option ${showAnswer && option.id === currentQuestion.correctOptionId ? 'correct' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      {showAnswer && option.id === currentQuestion.correctOptionId && (
                        <Check className="h-5 w-5 text-quiz-correct" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-quiz-primary" />
                Live Responses
              </h4>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {responseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex justify-between">
              {!showAnswer ? (
                <Button 
                  onClick={handleShowAnswer}
                  disabled={timeRemaining !== null && timeRemaining > 0}
                >
                  Show Answer
                </Button>
              ) : (
                questionIndex + 1 < totalQuestions ? (
                  <Button 
                    onClick={handleNextQuestion} 
                    className="bg-quiz-primary hover:bg-quiz-primary/90"
                  >
                    Next Question
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion} 
                    className="bg-quiz-primary hover:bg-quiz-primary/90"
                  >
                    Finish Quiz
                  </Button>
                )
              )}
            </div>
          </div>
        );
        
      case 'results':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Quiz Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockResults}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mockResults.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Total Students</span>
                      <span className="font-semibold">{studentCount}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">75%</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Highest Score</span>
                      <span className="font-semibold">100%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Lowest Score</span>
                      <span className="font-semibold">40%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="bg-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Quiz completed!</AlertTitle>
              <AlertDescription>
                All students have been notified that the quiz has ended.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button onClick={handleEndSession}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {!sessionCode ? (
        <div className="flex flex-col items-center justify-center space-y-8 py-12">
          <h2 className="text-2xl font-bold">Ready to Start Quiz?</h2>
          <p className="text-muted-foreground text-center max-w-md">
            When you start the session, students will be able to join using a unique code.
          </p>
          <Button 
            onClick={handleStartSession}
            className="bg-quiz-primary hover:bg-quiz-primary/90 text-lg py-6 px-8"
          >
            <Play className="mr-2 h-5 w-5" />
            Create Session
          </Button>
        </div>
      ) : (
        renderSessionState()
      )}
    </div>
  );
};

export default QuizSessionView;

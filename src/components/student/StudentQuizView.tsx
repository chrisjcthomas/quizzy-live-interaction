
import React, { useState, useEffect } from "react";
import { useQuizSession } from "@/contexts/QuizSessionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const StudentQuizView: React.FC = () => {
  const { 
    sessionCode, 
    currentQuestion, 
    timeRemaining, 
    selectedOption,
    isAnswerCorrect,
    submitAnswer,
    showResults,
    questionIndex,
    totalQuestions,
    leaveSession
  } = useQuizSession();
  
  const navigate = useNavigate();
  
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [score, setScore] = useState(0);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setFeedbackShown(false);
  }, [currentQuestion]);
  
  // Update the selected option from context if available
  useEffect(() => {
    if (selectedOption) {
      setSelectedOptionId(selectedOption);
      setHasSubmitted(true);
    }
  }, [selectedOption]);
  
  // Show feedback after submitting
  useEffect(() => {
    if (hasSubmitted && isAnswerCorrect !== null && !feedbackShown) {
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
      }
      setFeedbackShown(true);
    }
  }, [hasSubmitted, isAnswerCorrect, feedbackShown]);
  
  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !hasSubmitted && selectedOptionId) {
      handleSubmitAnswer();
    }
  }, [timeRemaining, hasSubmitted, selectedOptionId]);

  const handleSelectOption = (optionId: string) => {
    if (!hasSubmitted) {
      setSelectedOptionId(optionId);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOptionId && !hasSubmitted) {
      setHasSubmitted(true);
      await submitAnswer(selectedOptionId);
    }
  };

  const handleLeaveQuiz = () => {
    leaveSession();
    navigate("/");
  };

  if (showResults) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-8">
        <h2 className="text-2xl font-bold text-center">Quiz Completed!</h2>
        
        <Card className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
          <CardHeader>
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-6xl font-bold text-quiz-primary mb-4">
              {score} / {totalQuestions}
            </div>
            <Progress value={(score / totalQuestions) * 100} className="w-full h-4" />
            <p className="mt-4 text-center text-muted-foreground">
              You answered {score} out of {totalQuestions} questions correctly.
            </p>
          </CardContent>
        </Card>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Quiz ended</AlertTitle>
          <AlertDescription>
            The quiz session has been ended by the teacher.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center">
          <Button onClick={handleLeaveQuiz} className="bg-quiz-primary hover:bg-quiz-primary/90">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-8">
        <h2 className="text-2xl font-bold text-center">Waiting for quiz to start...</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Session: {sessionCode}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full border-4 border-quiz-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-center text-muted-foreground">
              The teacher will start the quiz soon.
            </p>
          </CardContent>
        </Card>
        
        <Button variant="outline" onClick={handleLeaveQuiz} className="w-full">
          Leave Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Question {questionIndex + 1} of {totalQuestions}</h3>
          <Progress 
            value={((questionIndex + 1) / totalQuestions) * 100}
            className="h-1 mt-1"
          />
        </div>
        
        {timeRemaining !== null && (
          <div className="flex items-center text-lg font-semibold">
            <Clock className="mr-1 h-5 w-5 text-quiz-primary" />
            {timeRemaining}s
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id} 
              className={`quiz-option ${selectedOptionId === option.id ? 'selected' : ''} 
                ${feedbackShown && option.id === currentQuestion.correctOptionId ? 'correct' : ''}
                ${feedbackShown && selectedOptionId === option.id && !isAnswerCorrect ? 'incorrect' : ''}`}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.text}
              
              {feedbackShown && option.id === selectedOptionId && isAnswerCorrect && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-quiz-correct" />
              )}
              
              {feedbackShown && option.id === selectedOptionId && !isAnswerCorrect && (
                <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-quiz-incorrect" />
              )}
              
              {feedbackShown && option.id === currentQuestion.correctOptionId && option.id !== selectedOptionId && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-quiz-correct" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {feedbackShown ? (
        <Alert className={isAnswerCorrect ? "bg-quiz-correct/10 border-quiz-correct" : "bg-quiz-incorrect/10 border-quiz-incorrect"}>
          {isAnswerCorrect ? (
            <>
              <CheckCircle className="h-4 w-4 text-quiz-correct" />
              <AlertTitle>Correct!</AlertTitle>
              <AlertDescription>
                Good job! Waiting for the next question...
              </AlertDescription>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-quiz-incorrect" />
              <AlertTitle>Incorrect</AlertTitle>
              <AlertDescription>
                The correct answer has been highlighted. Waiting for the next question...
              </AlertDescription>
            </>
          )}
        </Alert>
      ) : (
        <Button 
          onClick={handleSubmitAnswer} 
          className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
          disabled={!selectedOptionId || hasSubmitted}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};

export default StudentQuizView;

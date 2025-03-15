
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizSessionView from "@/components/teacher/QuizSessionView";

const TeacherQuizSession: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const handleSessionEnd = (sessionId: string | null) => {
    if (sessionId) {
      navigate(`/teacher/leaderboard/${sessionId}`);
    } else {
      navigate("/teacher/dashboard");
    }
  };
  
  if (!quizId) {
    return <div>Quiz ID is required</div>;
  }
  
  return (
    <div className="container py-8">
      <QuizSessionView quizId={quizId} onEndSession={handleSessionEnd} />
    </div>
  );
};

export default TeacherQuizSession;

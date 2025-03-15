
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuizSession } from "@/contexts/QuizSessionContext";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import QuizSessionView from "@/components/teacher/QuizSessionView";

const TeacherQuizSession: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user, logout } = useAuth();
  const { startSession, sessionCode } = useQuizSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "teacher" || !quizId) {
      navigate("/");
      return;
    }

    const initSession = async () => {
      try {
        await startSession(quizId);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to start session:", error);
        navigate("/teacher/dashboard");
      }
    };

    initSession();
  }, [quizId, user, startSession, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/teacher/dashboard")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-quiz-primary">Quizzy Live</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {sessionCode && (
              <div className="bg-quiz-primary/10 px-4 py-2 rounded">
                <span className="font-medium">Session Code:</span>{" "}
                <span className="font-bold text-quiz-primary">{sessionCode}</span>
              </div>
            )}
            <span className="hidden md:inline text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Starting quiz session...</p>
            </div>
          </div>
        ) : (
          <QuizSessionView />
        )}
      </main>
    </div>
  );
};

export default TeacherQuizSession;

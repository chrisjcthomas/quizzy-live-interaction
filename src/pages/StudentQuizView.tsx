
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuizSession } from "@/contexts/QuizSessionContext";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import StudentQuizView from "@/components/student/StudentQuizView";

const StudentQuiz: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { user, logout } = useAuth();
  const { leaveSession } = useQuizSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student" || !sessionCode) {
      navigate("/");
      return;
    }
    
    // The actual joining of the session is handled in the StudentJoinForm component
    // which redirects here after successful join
  }, [user, sessionCode, navigate]);

  const handleLogout = () => {
    leaveSession();
    logout();
    navigate("/");
  };

  const handleExit = () => {
    leaveSession();
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
              onClick={handleExit}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>
            <h1 className="text-2xl font-bold text-quiz-primary">Quizzy Live</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {user?.name}
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
        {sessionCode && <StudentQuizView />}
      </main>
    </div>
  );
};

export default StudentQuiz;


import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuizSession } from "@/contexts/QuizSessionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentJoinForm: React.FC = () => {
  const { joinAsStudent } = useAuth();
  const { joinSession } = useQuizSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !sessionCode) {
      toast({
        title: "Error",
        description: "Please enter your name and session code",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First authenticate as student
      const { sessionId, studentId } = await joinAsStudent(name, sessionCode);
      
      // Then join the quiz session
      await joinSession(sessionCode, name);
      
      toast({
        title: "Success",
        description: "You've joined the quiz session"
      });
      
      // Navigate to the student quiz view
      navigate("/student/quiz");
    } catch (error) {
      toast({
        title: "Failed to join",
        description: "Invalid session code or session is no longer active",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="session-code">Session Code</Label>
        <Input
          id="session-code"
          type="text"
          placeholder="ABCDEF"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
          disabled={isLoading}
          className="w-full text-center font-mono uppercase"
          maxLength={6}
        />
      </div>
      
      <Button type="submit" className="w-full bg-quiz-primary hover:bg-quiz-primary/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Quiz"
        )}
      </Button>
    </form>
  );
};

export default StudentJoinForm;

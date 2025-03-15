
import React, { useState, useEffect } from "react";
import { Quiz } from "@/types/quiz";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Play, Plus, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { teacherService } from "@/services/mockData";
import { useNavigate } from "react-router-dom";

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await teacherService.getQuizzes();
        setQuizzes(data);
        setFilteredQuizzes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredQuizzes(quizzes);
      return;
    }

    const filtered = quizzes.filter(
      quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const handleStartQuiz = (quizId: string) => {
    navigate(`/teacher/start-quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate("/teacher/create-quiz");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Quizzes</h2>
        <Button onClick={handleCreateQuiz} className="bg-quiz-primary hover:bg-quiz-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-muted">
              <CardHeader className="h-32"></CardHeader>
              <CardContent className="h-16"></CardContent>
              <CardFooter className="h-12"></CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quizzes found. Create your first quiz!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Created {format(new Date(quiz.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="mr-2">
                    {quiz.questions.length} questions
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/teacher/edit-quiz/${quiz.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="bg-quiz-primary hover:bg-quiz-primary/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;

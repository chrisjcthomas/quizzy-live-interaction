
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, ArrowLeft, Trophy, Clock, CheckCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Sample data for demonstration
const MOCK_STUDENT_DATA = [
  { id: "1", name: "Emma Thompson", score: 95, correctAnswers: 19, totalQuestions: 20, avgResponseTime: 4.2 },
  { id: "2", name: "Jacob Wilson", score: 90, correctAnswers: 18, totalQuestions: 20, avgResponseTime: 5.1 },
  { id: "3", name: "Olivia Martinez", score: 85, correctAnswers: 17, totalQuestions: 20, avgResponseTime: 3.9 },
  { id: "4", name: "Noah Johnson", score: 80, correctAnswers: 16, totalQuestions: 20, avgResponseTime: 6.3 },
  { id: "5", name: "Sophia Davis", score: 75, correctAnswers: 15, totalQuestions: 20, avgResponseTime: 5.7 },
  { id: "6", name: "Liam Garcia", score: 70, correctAnswers: 14, totalQuestions: 20, avgResponseTime: 7.2 },
  { id: "7", name: "Ava Rodriguez", score: 65, correctAnswers: 13, totalQuestions: 20, avgResponseTime: 8.1 },
  { id: "8", name: "Mason Lopez", score: 60, correctAnswers: 12, totalQuestions: 20, avgResponseTime: 6.5 },
  { id: "9", name: "Isabella Gonzalez", score: 55, correctAnswers: 11, totalQuestions: 20, avgResponseTime: 9.0 },
  { id: "10", name: "James Perez", score: 50, correctAnswers: 10, totalQuestions: 20, avgResponseTime: 7.8 },
];

// Sample quiz data
const MOCK_QUIZ_DATA = {
  title: "Science Quiz Finals",
  date: "November 10, 2023",
  totalParticipants: 28,
  averageScore: 75.5,
};

const LeaderboardPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState(MOCK_STUDENT_DATA);
  const [quizInfo, setQuizInfo] = useState(MOCK_QUIZ_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/");
      return;
    }

    // In a real app, fetch data based on sessionId
    const fetchLeaderboardData = async () => {
      try {
        // This would be a real API call
        // const response = await api.getSessionResults(sessionId);
        // setStudents(response.students);
        // setQuizInfo(response.quizInfo);
        
        // For now, just simulate loading
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [sessionId, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Sort students by score (highest first)
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

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
              <p className="mt-4 text-muted-foreground">Loading leaderboard data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-center">{quizInfo.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">Date</p>
                      <p className="font-medium">{quizInfo.date}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">Participants</p>
                      <p className="font-medium">{quizInfo.totalParticipants}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">Average Score</p>
                      <p className="font-medium">{quizInfo.averageScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">Session ID</p>
                      <p className="font-medium">{sessionId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top 3 Students */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {sortedStudents.slice(0, 3).map((student, index) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center text-white font-bold
                          ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>{student.correctAnswers}/{student.totalQuestions} correct</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{student.score}%</p>
                          <div className="flex items-center text-sm text-muted-foreground justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{student.avgResponseTime}s</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard Table */}
            <Card>
              <CardHeader>
                <CardTitle>Full Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Correct Answers</TableHead>
                      <TableHead className="text-right">Avg. Response Time</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.correctAnswers}/{student.totalQuestions}</TableCell>
                        <TableCell className="text-right">{student.avgResponseTime}s</TableCell>
                        <TableCell className="text-right font-bold">{student.score}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate("/teacher/dashboard")}
                className="mr-2"
              >
                Back to Dashboard
              </Button>
              <Button>
                Export Results
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;

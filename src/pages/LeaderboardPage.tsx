
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Download, Share } from "lucide-react";
import LeaderboardTable from "@/components/teacher/LeaderboardTable";
import QuizSummaryCard from "@/components/teacher/QuizSummaryCard";
import TopPerformersCard from "@/components/teacher/TopPerformersCard";

// Mock data - in a real app, this would come from an API
const mockStudentResults = [
  { 
    id: "1", 
    name: "Emma Johnson", 
    score: 0.95, 
    correctAnswers: 19, 
    totalQuestions: 20, 
    timeSpent: 485, 
    rank: 1 
  },
  { 
    id: "2", 
    name: "Liam Brown", 
    score: 0.90, 
    correctAnswers: 18, 
    totalQuestions: 20, 
    timeSpent: 512, 
    rank: 2 
  },
  { 
    id: "3", 
    name: "Olivia Davis", 
    score: 0.85, 
    correctAnswers: 17, 
    totalQuestions: 20, 
    timeSpent: 490, 
    rank: 3 
  },
  { 
    id: "4", 
    name: "Noah Wilson", 
    score: 0.80, 
    correctAnswers: 16, 
    totalQuestions: 20, 
    timeSpent: 545, 
    rank: 4 
  },
  { 
    id: "5", 
    name: "Ava Martinez", 
    score: 0.75, 
    correctAnswers: 15, 
    totalQuestions: 20, 
    timeSpent: 502, 
    rank: 5 
  },
  { 
    id: "6", 
    name: "Ethan Anderson", 
    score: 0.70, 
    correctAnswers: 14, 
    totalQuestions: 20, 
    timeSpent: 600, 
    rank: 6 
  },
  { 
    id: "7", 
    name: "Sophia Taylor", 
    score: 0.65, 
    correctAnswers: 13, 
    totalQuestions: 20, 
    timeSpent: 520, 
    rank: 7 
  },
  { 
    id: "8", 
    name: "Mason Thomas", 
    score: 0.60, 
    correctAnswers: 12, 
    totalQuestions: 20, 
    timeSpent: 580, 
    rank: 8 
  },
];

const mockQuizInfo = {
  id: "quiz-123",
  title: "Geography Quiz",
  description: "Test your knowledge of world geography",
  totalQuestions: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const LeaderboardPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  
  const handleBackToDashboard = () => {
    navigate("/teacher/dashboard");
  };
  
  const handleDownloadResults = () => {
    toast({
      title: "Results downloading",
      description: "Your results will be downloaded as a CSV file.",
    });
    // In a real app, this would trigger a CSV download
  };
  
  const handleShareResults = () => {
    // Copy a shareable link to clipboard
    navigator.clipboard.writeText(`https://quizapp.example/results/${sessionId}`);
    toast({
      title: "Link copied",
      description: "Shareable link has been copied to clipboard",
    });
  };
  
  // Calculate metrics for summary
  const totalStudents = mockStudentResults.length;
  const averageScore = mockStudentResults.reduce((acc, student) => acc + student.score, 0) / totalStudents;
  const averageTimeSpent = mockStudentResults.reduce((acc, student) => acc + student.timeSpent, 0) / totalStudents;
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{mockQuizInfo.title} Results</h1>
          <p className="text-muted-foreground">
            Session ID: {sessionId}
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleDownloadResults}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button variant="outline" onClick={handleShareResults}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="leaderboard">Full Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuizSummaryCard 
              title="Quiz Summary"
              totalStudents={totalStudents}
              averageScore={averageScore}
              averageTimeSpent={averageTimeSpent}
              totalQuestions={mockQuizInfo.totalQuestions}
            />
            
            <div className="md:col-span-2">
              <TopPerformersCard students={mockStudentResults} />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Students</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                students={mockStudentResults.slice(0, 5)} 
                showRank={true} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>All Results</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable students={mockStudentResults} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardPage;

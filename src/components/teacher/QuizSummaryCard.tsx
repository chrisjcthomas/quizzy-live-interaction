
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, XCircle, Percent } from "lucide-react";

interface QuizSummaryProps {
  title: string;
  totalStudents: number;
  averageScore: number;
  averageTimeSpent: number; // in seconds
  totalQuestions: number;
}

const QuizSummaryCard: React.FC<QuizSummaryProps> = ({
  title,
  totalStudents,
  averageScore,
  averageTimeSpent,
  totalQuestions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-quiz-primary mr-2" />
              <span>Total Students</span>
            </div>
            <span className="font-semibold">{totalStudents}</span>
          </li>
          
          <li className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <Percent className="h-5 w-5 text-quiz-primary mr-2" />
              <span>Average Score</span>
            </div>
            <span className="font-semibold">{Math.round(averageScore * 100)}%</span>
          </li>
          
          <li className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-quiz-primary mr-2" />
              <span>Average Time</span>
            </div>
            <span className="font-semibold">{formatTime(averageTimeSpent)}</span>
          </li>
          
          <li className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-quiz-correct mr-2" />
              <span>Questions</span>
            </div>
            <span className="font-semibold">{totalQuestions}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default QuizSummaryCard;

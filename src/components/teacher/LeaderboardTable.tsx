
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Award, Medal } from "lucide-react";

interface StudentResult {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  rank: number;
}

interface LeaderboardTableProps {
  students: StudentResult[];
  showRank?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  students,
  showRank = true
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableCaption>Student performance results</TableCaption>
      <TableHeader>
        <TableRow>
          {showRank && <TableHead className="w-16">Rank</TableHead>}
          <TableHead>Student</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Correct</TableHead>
          <TableHead className="text-right">Time Spent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id} className={student.rank <= 3 ? "bg-muted/30" : ""}>
            {showRank && (
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {getRankIcon(student.rank)}
                  <span className="ml-1">{student.rank}</span>
                </div>
              </TableCell>
            )}
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell className="text-right">{Math.round(student.score * 100)}%</TableCell>
            <TableCell className="text-right">{student.correctAnswers}/{student.totalQuestions}</TableCell>
            <TableCell className="text-right">{formatTime(student.timeSpent)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default LeaderboardTable;

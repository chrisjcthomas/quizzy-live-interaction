
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";

interface Student {
  id: string;
  name: string;
  score: number;
  rank: number;
}

interface TopPerformersCardProps {
  students: Student[];
}

const TopPerformersCard: React.FC<TopPerformersCardProps> = ({ students }) => {
  // Get only top 3 students
  const topThree = students.filter(student => student.rank <= 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topThree.map((student) => (
            <div 
              key={student.id} 
              className="flex items-center p-3 rounded-lg border bg-muted/20"
            >
              <div className="mr-4">
                {student.rank === 1 ? (
                  <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                ) : student.rank === 2 ? (
                  <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-amber-700 flex items-center justify-center">
                    <Medal className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  Score: {Math.round(student.score * 100)}%
                </p>
              </div>
            </div>
          ))}

          {topThree.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No students have completed the quiz yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformersCard;

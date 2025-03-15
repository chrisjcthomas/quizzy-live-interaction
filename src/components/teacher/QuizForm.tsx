
import React, { useState } from "react";
import { Quiz, QuizQuestion, QuizOption } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Check, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { teacherService } from "@/services/mockData";
import { useNavigate } from "react-router-dom";

interface QuizFormProps {
  initialQuiz?: Quiz;
  isEditing?: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ initialQuiz, isEditing = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialQuiz?.title || "");
  const [description, setDescription] = useState(initialQuiz?.description || "");
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuiz?.questions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      text: "",
      options: [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
        { id: generateId(), text: "" }
      ],
      correctOptionId: "",
      timeLimit: 30
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(updatedQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionId = optionId;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      id: generateId(),
      text: ""
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    
    // Reset correctOptionId if the removed option was the correct one
    const question = updatedQuestions[questionIndex];
    const removedOptionId = questions[questionIndex].options[optionIndex].id;
    
    if (question.correctOptionId === removedOptionId) {
      question.correctOptionId = "";
    }
    
    setQuestions(updatedQuestions);
  };

  const validateQuiz = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a quiz title",
        variant: "destructive"
      });
      return false;
    }
    
    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question",
        variant: "destructive"
      });
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.text.trim()) {
        toast({
          title: "Empty question",
          description: `Question ${i + 1} has no text`,
          variant: "destructive"
        });
        return false;
      }
      
      if (q.options.length < 2) {
        toast({
          title: "Not enough options",
          description: `Question ${i + 1} needs at least 2 options`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!q.correctOptionId) {
        toast({
          title: "No correct answer",
          description: `Please select a correct answer for question ${i + 1}`,
          variant: "destructive"
        });
        return false;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          toast({
            title: "Empty option",
            description: `Option ${j + 1} in question ${i + 1} has no text`,
            variant: "destructive"
          });
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const quizData = {
        title,
        description,
        questions,
        createdBy: "teacher1" // In a real app, this would be the current user's ID
      };
      
      let result;
      if (isEditing && initialQuiz) {
        // In a real app, this would call an update API
        result = { ...initialQuiz, ...quizData };
        toast({
          title: "Quiz updated",
          description: "Your quiz has been updated successfully"
        });
      } else {
        result = await teacherService.createQuiz(quizData);
        toast({
          title: "Quiz created",
          description: "Your quiz has been created successfully"
        });
      }
      
      navigate("/teacher/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update quiz" : "Failed to create quiz",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{isEditing ? "Edit Quiz" : "Create New Quiz"}</h2>
        
        <div className="space-y-2">
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            placeholder="Enter quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-2xl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter quiz description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-w-2xl h-24"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Questions</h3>
          <Button
            type="button"
            onClick={addNewQuestion}
            className="bg-quiz-primary hover:bg-quiz-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No questions yet. Click "Add Question" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={question.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-quiz-primary/5 to-quiz-secondary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Question {qIndex + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                    <Textarea
                      id={`question-${qIndex}`}
                      placeholder="Enter question"
                      value={question.text}
                      onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Label htmlFor={`time-limit-${qIndex}`} className="mr-2">Time Limit (seconds):</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`time-limit-${qIndex}`}
                        type="number"
                        min="5"
                        max="300"
                        value={question.timeLimit}
                        onChange={(e) => updateQuestion(qIndex, 'timeLimit', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${
                              question.correctOptionId === option.id 
                                ? 'bg-quiz-correct text-white hover:bg-quiz-correct/90' 
                                : ''
                            }`}
                            onClick={() => setCorrectOption(qIndex, option.id)}
                          >
                            {question.correctOptionId === option.id && <Check className="h-4 w-4" />}
                          </Button>
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className="flex-1"
                          />
                          {question.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {question.options.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/teacher/dashboard")}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-quiz-primary hover:bg-quiz-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Quiz" : "Create Quiz"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;

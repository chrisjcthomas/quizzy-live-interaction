
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuizSession } from "@/contexts/QuizSessionContext";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  code: z.string().length(6, {
    message: "Session code must be 6 characters.",
  }).toUpperCase(),
});

const StudentJoinForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { joinAsStudent } = useAuth();
  const { joinSession } = useQuizSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // First, authenticate as a student
      const { sessionId, studentId } = await joinAsStudent(values.name, values.code);
      
      // Then, join the quiz session
      await joinSession(values.code, values.name);
      
      // Redirect to the student quiz view
      navigate(`/student/quiz/${values.code}`);
    } catch (error) {
      console.error("Failed to join quiz:", error);
      toast({
        title: "Error",
        description: "Failed to join quiz. Please check the session code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ABC123" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join Quiz"}
        </Button>
      </form>
    </Form>
  );
};

export default StudentJoinForm;

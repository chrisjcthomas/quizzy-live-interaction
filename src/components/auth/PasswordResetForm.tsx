
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

interface PasswordResetFormProps {
  onBackToLogin: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBackToLogin }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, make an API call to send reset link
      setIsSubmitted(true);
      
      toast({
        title: "Success",
        description: "If an account exists with that email, a reset link has been sent"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the reset link",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full bg-quiz-primary hover:bg-quiz-primary/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onBackToLogin}
            className="w-full mt-2"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-sm">
            If we found an account matching that email, we've sent instructions to reset your password.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check your inbox and spam folder.
          </p>
          <Button 
            variant="outline" 
            onClick={onBackToLogin}
            className="mt-4"
          >
            Return to login
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasswordResetForm;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import StudentJoinForm from "@/components/auth/StudentJoinForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { Lightbulb, Users, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("join");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 bg-gradient-to-br from-quiz-primary to-quiz-secondary p-8 md:p-16 flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Quizzy Live
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-xl animate-slide-in">
            Engage your students with real-time interactive quizzes during class.
          </p>
          
          <div className="space-y-6 mt-4">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Real-time Interaction</h3>
                <p className="text-white/80">Instant feedback and live results</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Boost Engagement</h3>
                <p className="text-white/80">Make learning fun and interactive</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Easy to Join</h3>
                <p className="text-white/80">No account needed for students</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-8 md:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join">Join Quiz</TabsTrigger>
                <TabsTrigger value="login">Log In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="join" className="mt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Join a Quiz</h2>
                  <p className="text-muted-foreground">
                    Enter your name and the session code provided by your teacher
                  </p>
                </div>
                <StudentJoinForm />
              </TabsContent>
              
              <TabsContent value="login" className="mt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">
                    Log in to your Quizzy account
                  </p>
                </div>
                <LoginForm />
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("reset-password")}
                    className="text-sm text-muted-foreground"
                  >
                    Forgot your password?
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Don't have an account yet?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("signup")}
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
                  <p className="text-muted-foreground">
                    Sign up to create and manage quizzes
                  </p>
                </div>
                <SignupForm />
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Already have an account?
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("login")}
                  >
                    Log in
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="reset-password" className="mt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                  <p className="text-muted-foreground">
                    Enter your email to receive a password reset link
                  </p>
                </div>
                <PasswordResetForm onBackToLogin={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white/80 py-4 text-center text-sm">
        <p>© 2023 Quizzy Live. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;

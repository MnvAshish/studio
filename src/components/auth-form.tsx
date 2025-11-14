"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon, PokeballIcon } from './icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PokeballIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Sign in to continue your adventure.' : 'Join TaskMon and start your journey today.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          {mode === 'login' ? (
            <p>
              No account yet?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

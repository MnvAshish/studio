'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
       <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome to TaskMon!</CardTitle>
          <CardDescription>Your adventure in productivity starts now.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">
                Ready to focus and catch some Pokémon? Head over to the Pomodoro app to start your first session.
            </p>
          <Button asChild>
            <Link href="/pomodoro">
              Start a Session <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

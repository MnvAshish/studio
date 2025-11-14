import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PokeballIcon } from '@/components/icons';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  const features = [
    {
      title: 'Task-Based Maps',
      description: 'Assign Pokémon-style maps to your tasks to customize your journey.',
    },
    {
      title: 'Partner Pokémon',
      description: 'Choose a partner Pokémon to accompany you during your Pomodoro sessions.',
    },
    {
      title: 'Encounter & Collect',
      description: 'Discover and catch new Pokémon during your breaks. Can you collect them all?',
    },
    {
      title: 'Level Up',
      description: 'Stay productive to level up your partner Pokémon and unlock new potentials.',
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <PokeballIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline">TaskMon</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login" prefetch={false}>
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/register" prefetch={false}>
              Register <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40">
          <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Turn Your Tasks into an Adventure
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  TaskMon fuses the Pomodoro Technique with the thrill of Pokémon. Stay focused, complete your tasks, and build your unique Pokémon collection.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={800}
                  className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover sm:w-full"
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Gamify Your Productivity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Every Pomodoro session is a step forward in your Pokémon adventure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              {features.map((feature, index) => (
                 <div key={index} className="flex gap-4">
                  <CheckCircle2 className="h-8 w-8 text-primary mt-1" />
                  <div className="grid gap-1">
                    <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                 </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 TaskMon. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

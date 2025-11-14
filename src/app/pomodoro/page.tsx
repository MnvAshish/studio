'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Play, Pause, Repeat, Sparkles, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { pokemonEncounterGeneration } from '@/ai/flows/pokemon-encounter-generation';
import { Skeleton } from '@/components/ui/skeleton';
import { PokeballIcon } from '@/components/icons';

type TimerMode = 'work' | 'break';

export default function PomodoroPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Timer state
  const [sessionDuration, setSessionDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(sessionDuration);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');

  // Game state
  const [sessionCount, setSessionCount] = useState(0);
  const [encounter, setEncounter] = useState<{ pokemonName: string; isShiny: boolean } | null>(null);
  const [isEncounterLoading, setIsEncounterLoading] = useState(false);

  const mapImage = PlaceHolderImages.find((img) => img.id === 'viridian-forest-map');
  const partnerImage = PlaceHolderImages.find((img) => img.id === 'partner-pikachu');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleEncounter = async () => {
    setIsEncounterLoading(true);
    setEncounter(null);
    try {
      const result = await pokemonEncounterGeneration({
        taskMap: 'Viridian Forest',
        partnerPokemon: 'Pikachu',
        sessionCount: sessionCount,
        sessionDuration: 25,
      });

      if (result.encounterOccurs && result.encounteredPokemon) {
        setEncounter({ pokemonName: result.encounteredPokemon, isShiny: result.shiny || false });
      }
    } catch (error) {
      console.error('Failed to generate encounter:', error);
    } finally {
      setIsEncounterLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setSessionCount(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
        handleEncounter();
      } else {
        setMode('work');
        setTimeLeft(sessionDuration);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, sessionDuration, sessionCount]);


  if (loading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 w-full max-w-6xl mx-auto p-4">
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-40 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration - timeLeft) / sessionDuration) * 100;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Current Task: Conquer Viridian Forest</CardTitle>
                <CardDescription>Stay focused to help your partner Pokémon level up!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                        <p className="text-lg font-medium text-muted-foreground">{mode === 'work' ? 'Focus Session' : 'Short Break'}</p>
                        <p className="text-7xl font-bold font-mono tracking-tighter">{formatTime(timeLeft)}</p>
                    </div>
                    <Progress value={progress} className="my-4 h-2" />
                    <div className="flex justify-center gap-4 mt-4">
                        <Button onClick={() => setIsActive(!isActive)} size="lg">
                            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => { setIsActive(false); setTimeLeft(sessionDuration); setMode('work'); }}>
                            <Repeat className="mr-2 h-5 w-5" />
                            Reset
                        </Button>
                    </div>
                </div>
            </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-2xl">Map</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Viridian Forest</span>
                    </div>
                </CardHeader>
                <CardContent>
                    {mapImage && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                            <Image
                                src={mapImage.imageUrl}
                                alt={mapImage.description}
                                data-ai-hint={mapImage.imageHint}
                                fill
                                className="object-cover"
                            />
                            {partnerImage && (
                                <Image
                                    src={partnerImage.imageUrl}
                                    alt={partnerImage.description}
                                    data-ai-hint={partnerImage.imageHint}
                                    width={60}
                                    height={60}
                                    className="absolute bottom-4 left-4 animate-bounce"
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">My Tasks</CardTitle>
                    <CardDescription>Manage your adventures here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                    </Button>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-accent text-accent-foreground">
                            <p className="font-medium">Conquer Viridian Forest</p>
                            <span className="text-sm">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                            <p className="font-medium">Explore Mt. Moon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={!!encounter || isEncounterLoading} onOpenChange={(open) => !open && setEncounter(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-center">
                            {isEncounterLoading ? 'Something rustles in the tall grass...' : 'A wild Pokémon appeared!'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
                    {isEncounterLoading ? (
                        <PokeballIcon className="h-16 w-16 animate-spin text-primary" />
                    ) : encounter ? (
                        <div className="text-center space-y-4">
                            <Image src={`https://picsum.photos/seed/${encounter.pokemonName}/200/200`} alt={encounter.pokemonName} width={150} height={150} className="mx-auto rounded-full border" />
                            <p className="text-2xl font-bold flex items-center justify-center gap-2">
                            {encounter.pokemonName}
                            {encounter.isShiny && <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />}
                            </p>
                            <Button size="lg" onClick={() => setEncounter(null)}>
                                <PokeballIcon className="mr-2 h-5 w-5" />
                                Capture
                            </Button>
                        </div>
                    ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        </div>
        </div>
      </main>
    </div>
  );
}

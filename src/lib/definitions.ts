import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  level: number;
  isShiny: boolean;
};

export type Task = {
  id: string;
  name: string;
  map: string; // e.g., 'Viridian Forest'
  partnerPokemonId?: number;
  completedSessions: number;
};

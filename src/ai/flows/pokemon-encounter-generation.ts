// src/ai/flows/pokemon-encounter-generation.ts
'use server';

/**
 * @fileOverview Determines if a Pokemon encounter occurs after a pomodoro session.
 *
 * - pokemonEncounterGeneration - A function that determines if a Pokemon encounter occurs.
 * - PokemonEncounterGenerationInput - The input type for the pokemonEncounterGeneration function.
 * - PokemonEncounterGenerationOutput - The return type for the pokemonEncounterGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PokemonEncounterGenerationInputSchema = z.object({
  taskMap: z.string().describe('The map associated with the task (e.g., Viridian Forest, Mt. Moon).'),
  partnerPokemon: z.string().describe('The name of the partner Pokemon for the session (e.g., Pikachu, Bulbasaur).'),
  sessionCount: z.number().describe('The number of pomodoro sessions completed for the task.'),
  sessionDuration: z.number().describe('The duration of each pomodoro session in minutes.'),
});

export type PokemonEncounterGenerationInput = z.infer<typeof PokemonEncounterGenerationInputSchema>;

const PokemonEncounterGenerationOutputSchema = z.object({
  encounterOccurs: z.boolean().describe('Whether a Pokemon encounter should occur during the break.'),
  encounteredPokemon: z.string().optional().describe('The name of the Pokemon encountered, if any.'),
  shiny: z.boolean().optional().describe('Whether the pokemon encountered is shiny.'),
});

export type PokemonEncounterGenerationOutput = z.infer<typeof PokemonEncounterGenerationOutputSchema>;

export async function pokemonEncounterGeneration(input: PokemonEncounterGenerationInput): Promise<PokemonEncounterGenerationOutput> {
  return pokemonEncounterGenerationFlow(input);
}

const pokemonEncounterPrompt = ai.definePrompt({
  name: 'pokemonEncounterPrompt',
  input: {schema: PokemonEncounterGenerationInputSchema},
  output: {schema: PokemonEncounterGenerationOutputSchema},
  prompt: `You are an expert Pokemon encounter generator. Based on the following information, determine if a Pokemon encounter should occur after the pomodoro session.

Task Map: {{{taskMap}}}
Partner Pokemon: {{{partnerPokemon}}}
Session Count: {{{sessionCount}}}
Session Duration: {{{sessionDuration}}} minutes

Consider the task map, partner Pokemon, session count, and session duration to determine if an encounter should occur. Some maps are more likely to have encounters than others. The partner Pokemon might influence the type of Pokemon encountered or the likelihood of a shiny Pokemon. Higher session counts could increase the chance of rare encounters.

Return a boolean value for encounterOccurs. If encounterOccurs is true, return an encounteredPokemon name and whether it is shiny or not.`,
});

const pokemonEncounterGenerationFlow = ai.defineFlow(
  {
    name: 'pokemonEncounterGenerationFlow',
    inputSchema: PokemonEncounterGenerationInputSchema,
    outputSchema: PokemonEncounterGenerationOutputSchema,
  },
  async input => {
    const {output} = await pokemonEncounterPrompt(input);
    return output!;
  }
);

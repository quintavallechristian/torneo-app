'use server';
import { createClient } from '@/utils/supabase/server';

import { Match, createMatchSchema } from '@/types';
import { redirect } from 'next/navigation';

import * as z from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMatch(
  formData: FormData,
  minAllowedPlayers: number,
  maxAllowedPlayers: number,
): Promise<{ form: Match; errors: any }> {
  const name = formData.get('name') as string;
  const game_id = formData.get('game') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  const min_players = Number(formData.get('min_players') ?? 0);
  const max_players = Number(formData.get('max_players') ?? 0);

  const form: Match = {
    name,
    game_id,
    description,
    startAt,
    endAt,
    min_players,
    max_players,
  };

  const validationResult = createMatchSchema(
    minAllowedPlayersmaxAllowedPlayers,
  ).safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('matches')
    .insert([{ name, game_id, description, startAt, endAt }]);

  if (error) {
    console.error('Error creating match:', error);
    return { form, errors: null };
  } else {
    console.log('match created successfully:', data);
    redirect('/matches');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function editMatch(
  formData: FormData,
  matchId: string,
  minAllowedPlayers: number,
  maxAllowedPlayers: number,
): Promise<{ form: Match; errors: any }> {
  const name = formData.get('name') as string;
  const game_id = formData.get('game') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  const min_players = Number(formData.get('min_players') ?? 0);
  const max_players = Number(formData.get('max_players') ?? 0);
  console.log(formData);

  const form: Match = {
    name,
    game_id,
    description,
    startAt,
    endAt,
    min_players,
    max_players,
  };

  const validationResult = createMatchSchema(
    minAllowedPlayers,
    maxAllowedPlayers,
  ).safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('matches')
    .update([{ name, game_id, description, startAt, endAt }])
    .eq('id', matchId);

  if (error) {
    console.error('Error updating match:', error);
    return { form, errors: null };
  } else {
    redirect(`/matches/${matchId}`);
  }
}

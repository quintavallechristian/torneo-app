'use server'
import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation';

 export async function createTournament(formData: FormData) {
  const name = formData.get('name') as string;
    const game_id = formData.get('game') as string;
    const description = formData.get('description') as string;
    const startAt = formData.get('startAt') as string;
    const endAt = formData.get('endAt') as string;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ name, game_id, description, startAt, endAt }]);

    if (error) {
      console.error('Error creating tournament:', error);
    } else {
      console.log('Tournament created successfully:', data);
      redirect('/tournaments')
    }
  }
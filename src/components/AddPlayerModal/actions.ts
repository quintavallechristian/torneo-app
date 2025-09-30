// actions.ts
'use server';
import { createClient } from '@/utils/supabase/server';

export async function addPlayer({
  profile_id,
  match_id,
}: {
  profile_id: string;
  match_id: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles_matches')
      .insert([{ profile_id, match_id }]);

    if (error) {
      console.error('Error creating profiles_matches:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Server action addPlayer error:', err);
    if (err && typeof err === 'object' && 'code' in err) {
      throw (err as { code: unknown }).code;
    }
    throw err;
  }
}

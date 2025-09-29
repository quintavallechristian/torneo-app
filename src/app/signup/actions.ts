'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (password !== confirmPassword) {
    console.error('Passwords do not match');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error);
  } else {
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const birthday = formData.get('birthday') as string;
    const country = formData.get('country') as string;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { user_id: data.user?.id, firstname, lastname, birthday, country },
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
    } else {
      console.log('Profile created successfully:', profileData);
    }

    const { data: roleData, error: roleError } = await supabase
      .from('users_roles')
      .insert([{ user_id: data.user?.id, role: 'user' }]);

    if (roleError) {
      console.error('Error assigning role:', roleError);
    } else {
      console.log('Role assigned successfully:', roleData);
    }
  }
  //revalidatePath('/', 'layout')
  redirect('/');
}

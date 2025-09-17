'use server'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/server'


import { ChevronLeft } from "lucide-react";
import Link from 'next/link';

 export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword
    ) {
      console.error('Passwords do not match');
      return;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error);
    } else {
      //update profiles table
      const firstname = formData.get("firstname") as string;
      const lastname = formData.get("lastname") as string;
      const birthday = formData.get("birthday") as string;
      const country = formData.get("country") as string;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ user_id: data.user?.id, firstname, lastname, birthday, country }]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('Profile created successfully:', profileData);
      }

    }
  }


export default async function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <Button className="" variant="ghost" size="sm">
            <Link href='/tournaments' className="flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <ChevronLeft className='inline mr-2 h-4 w-4' />
              Indietro
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2 text-center">Crea il tuo account</h1>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Benvenuto! Registrati per partecipare ai tornei e gestire il tuo profilo.</p>
        <form action={signup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input type="email" id="email" name="email" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input type="password" id="password" name="password" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div className="w-1/2">
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conferma Password</label>
              <Input type="password" id="confirm_password" name="confirm_password" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
              <Input type="text" id="firstname" name="firstname" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cognome</label>
              <Input type="text" id="lastname" name="lastname" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data di nascita</label>
              <Input type="date" id="birthday" name="birthday" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div className="w-1/2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazione</label>
              <Input type="text" id="country" name="country" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-semibold py-2 rounded-lg transition-all shadow-md">Registrati</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
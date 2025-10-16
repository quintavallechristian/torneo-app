import { Button } from '@/components/ui/button';
import { login } from './actions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SpotlightCard>
        <div className="mb-6 flex items-center justify-between">
          <Button className="" variant="ghost" size="sm">
            <Link
              href="/matches"
              className="flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ChevronLeft className="inline mr-2 h-4 w-4" />
              Indietro
            </Link>
          </Button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
            Accedi al tuo account
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Entra per gestire le tue partite e partecipare alle competizioni!
          </p>
        </div>
        <form action={login} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              placeholder="Inserisci la tua email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <span className="text-xs mt-2 text-gray-400 dark:text-gray-500 text-center">
              Non hai un account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Registrati
              </Link>
            </span>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}

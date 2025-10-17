'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { signup } from '../actions';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { useState } from 'react';

export default function SignupPage() {
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <SpotlightCard className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <Button className="" variant="ghost" size="sm">
            <Link
              href="/matches"
              className="flex items-center text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ChevronLeft className="inline mr-2 h-4 w-4" />
              Indietro
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2 text-center">
          Crea il tuo account gestore
        </h1>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-6">
          Benvenuto! Registrati per partecipare alle partite e gestire il tuo
          profilo.
        </p>
        <form
          action={signup.bind(null, { manager: true })}
          className="space-y-4"
        >
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome
              </label>
              <Input
                type="text"
                id="firstname"
                name="firstname"
                autoComplete="given-name"
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cognome
              </label>
              <Input
                type="text"
                id="lastname"
                name="lastname"
                autoComplete="family-name"
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>
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
              autoComplete="email"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-4"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
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
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Conferma Password
              </label>
              <Input
                type="password"
                id="confirm_password"
                name="confirm_password"
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Data di nascita
              </label>
              <DatePicker onSelect={setSelectedStartDate} />
              {selectedStartDate && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedStartDate.toLocaleDateString()}
                </p>
              )}
              <input
                type="hidden"
                name="birthday"
                value={
                  selectedStartDate
                    ? selectedStartDate.toISOString().slice(0, 10)
                    : ''
                }
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nazione
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              Registrati
            </Button>
            <span className="text-xs mt-2 text-gray-400 dark:text-gray-500 text-center">
              Non hai un locale?{' '}
              <Link
                href="/signup"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Registratati come utente
              </Link>
            </span>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}

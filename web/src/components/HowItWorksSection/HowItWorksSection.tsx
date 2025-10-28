'use client';

import { UserPlus, DicesIcon, Trophy, BarChart3 } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import SpotlightCard from '../SpotlightCard/SpotlightCard';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-10 w-10" />,
      title: 'Registrati',
      description:
        'Crea il tuo account gratuito in pochi secondi. Nessuna carta di credito richiesta.',
      number: '01',
    },
    {
      icon: <DicesIcon className="h-10 w-10" />,
      title: 'Gioca',
      description:
        'Partecipa alle partite nei locali partner o organizza le tue partite con amici.',
      number: '02',
    },
    {
      icon: <Trophy className="h-10 w-10" />,
      title: 'Scala il Ranking',
      description:
        'Ogni vittoria ti fa salire in classifica. Compete con giocatori di tutto il paese.',
      number: '03',
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: 'Traccia i Progressi',
      description:
        'Monitora le tue statistiche, scopri i tuoi giochi preferiti e condividi i risultati.',
      number: '04',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Come funziona</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Inizia a giocare in 4 semplici passi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <SpotlightCard className="border-2 hover:border-indigo-500 transition-all duration-300 h-full py-8 px-4">
                <CardContent className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-400">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

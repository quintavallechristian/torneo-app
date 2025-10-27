'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import SpotlightCard from '../SpotlightCard/SpotlightCard';

export default function PricingPreview() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Per giocatori individuali',
      features: [
        'Accesso a tutte le partite pubbliche',
        'Profilo personale e statistiche',
        'Ricerca giochi e luoghi',
        'Classifiche globali',
      ],
      cta: 'Inizia Gratis',
      ctaLink: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 199,
      description: 'Per locali e community',
      features: [
        'Tutti i giochi attivi',
        'Classifiche locali e regionali',
        'Tornei automatici',
        'Dashboard staff',
        'Supporto dedicato',
      ],
      cta: 'Prova 30 Giorni Gratis',
      ctaLink: '/pricing',
      highlight: true,
    },
    {
      name: 'Premium',
      price: 349,
      description: 'Per catene e multi-sede',
      features: [
        'Tutte le funzionalità Pro',
        'Classifiche multi-locale',
        'Branding personalizzato',
        'Statistiche avanzate',
        'Integrazione POS',
      ],
      cta: 'Contattaci',
      ctaLink: '/pricing',
      highlight: false,
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Piani per ogni esigenza
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prezzi semplici e trasparenti
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scegli il piano perfetto per te. Sempre con 30 giorni di prova
            gratuita.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <SpotlightCard
              key={plan.name}
              className={`rounded-2xl shadow-xl p-8 border transition-all ${
                plan.highlight
                  ? 'border-indigo-500 bg-background scale-105 relative'
                  : 'border-border bg-card'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-linear-to-r pt-4 from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Più Popolare
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6 min-h-[48px]">
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                  {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground ml-2">/mese</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="text-green-500 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : ''
                }`}
                variant={plan.highlight ? 'default' : 'outline'}
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </SpotlightCard>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              Vedi tutti i piani e funzionalità
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

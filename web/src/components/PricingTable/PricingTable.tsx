'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import SpotlightCard from '../SpotlightCard/SpotlightCard';

export default function PricingTable() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const togglePrice = (monthly: number) =>
    billing === 'monthly'
      ? `€${monthly}/mese`
      : `€${(monthly * 12 * 0.8).toFixed(0)}/anno`; // 20% sconto annuale

  const plans = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfetto per bar e pub che vogliono iniziare.',
      features: [
        'Fino a 3 giochi attivi',
        '100 giocatori registrati',
        'Ranking locale interno',
        'Gestione partite base',
        'Accesso web + app mobile',
      ],
      highlight: false,
    },
    {
      name: 'Pro',
      price: 199,
      description: 'Per locali con community attiva e tornei regolari.',
      features: [
        'Tutti i giochi attivi',
        'Classifiche locali e regionali',
        'Tornei automatici',
        'Dashboard staff',
        'Supporto dedicato',
      ],
      highlight: true,
    },
    {
      name: 'Premium',
      price: 349,
      description: 'Ideale per catene e locali con più sedi.',
      features: [
        'Tutte le funzionalità Pro',
        'Classifiche multi-locale',
        'Branding personalizzato',
        'Statistiche avanzate',
        'Integrazione gestionale / POS',
      ],
      highlight: false,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Tariffe PartitApp for Business
        </h2>
        <p className="text-lg text-gray-300 mb-10">
          Scegli il piano giusto per il tuo locale e unisciti alla rete dei
          Board Game Restaurant.
        </p>

        {/* Toggle mensile/annuale */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full font-medium transition ${
                billing === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700'
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-full font-medium transition ${
                billing === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700'
              }`}
            >
              Annuale <span className="ml-1 text-xs text-green-500">–20%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <SpotlightCard
              key={plan.name}
              className={`rounded-2xl shadow-xl p-8 border transition-all ${
                plan.highlight
                  ? 'border-indigo-500 bg-white scale-105'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              <p className="text-4xl font-bold text-indigo-600 mb-8">
                {togglePrice(plan.price)}
              </p>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="text-green-500 h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Prova gratuita 30 giorni
              </button>
            </SpotlightCard>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-10">
          *Prezzi IVA esclusa. Nessun vincolo di rinnovo. Puoi disdire in
          qualsiasi momento.
        </p>
      </div>
    </section>
  );
}

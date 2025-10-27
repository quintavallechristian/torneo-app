'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-12 w-12" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto a rivoluzionare il tuo locale?
            </h2>

            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Unisciti a centinaia di locali che hanno già scelto PartitApp per
              gestire la loro community di giocatori. Inizia oggi gratuitamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Prova Gratis per 30 Giorni
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Link href="/pricing">Vedi i Piani</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm opacity-75">
              ✓ Nessun impegno &nbsp; ✓ Cancellazione in qualsiasi momento
              &nbsp; ✓ Supporto dedicato
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

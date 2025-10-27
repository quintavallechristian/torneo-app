'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, DicesIcon } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <DicesIcon className="h-4 w-4" />
              La piattaforma per organizzare partite
            </div>
          </div>

          <h1 className="pb-4 text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Organizza, Gioca,
            <br />
            Domina il Ranking
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            La piattaforma completa per gestire partite, tornei e classifiche.
            Perfetta per board game café, pub e community di giocatori.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/signup" className="flex items-center gap-2">
                Inizia Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6"
            >
              <Link href="#features">Scopri di più</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✓ Nessuna carta di credito richiesta &nbsp; ✓ Setup in 5 minuti
          </p>
        </div>
      </div>
    </section>
  );
}

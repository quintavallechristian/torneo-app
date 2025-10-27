'use client';

import {
  Trophy,
  Users,
  MapPin,
  BarChart3,
  Calendar,
  Zap,
  Heart,
  Clock,
  Award,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SpotlightCard from '../SpotlightCard/SpotlightCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Gestione Partite',
      description:
        'Crea e gestisci partite in pochi click. Tieni traccia dello stato: programmate, in corso o completate.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'Ranking Automatico',
      description:
        'Sistema di classifiche automatiche per giocatori, giochi e luoghi. Scopri chi domina la scena.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community di Giocatori',
      description:
        'Connetti giocatori appassionati, crea una community attiva e fidelizza i tuoi clienti.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Localizzazione Luoghi',
      description:
        'Trova i luoghi di gioco più vicini con la mappa interattiva e geolocalizzazione.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Statistiche Avanzate',
      description:
        'Dashboard completa con statistiche dettagliate su partite, vittorie, giochi più giocati e molto altro.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Modalità Presentazione',
      description:
        'Mostra le classifiche su schermi TV in tempo reale per coinvolgere il pubblico del tuo locale.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Preferiti e Wishlist',
      description:
        'Salva giochi e luoghi preferiti, crea la tua wishlist personale e ricevi notifiche.',
      color: 'from-rose-500 to-red-500',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Sincronizzazione BGG',
      description:
        'Importa automaticamente i tuoi giochi da BoardGameGeek con tutte le informazioni.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Tornei Automatici',
      description:
        'Organizza tornei con eliminazione diretta o round robin. Sistema di gestione completo.',
      color: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tutto ciò che ti serve
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un ecosistema completo per gestire ogni aspetto della tua community
            di giocatori
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              className="border-2 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="pt-6">
                <div
                  className={`inline-flex p-3 rounded-2xl bg-linear-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { Users, Calendar, MapPin, Trophy } from 'lucide-react';

export default function StatsPreview() {
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: '10.000+',
      label: 'Giocatori Attivi',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      value: '50.000+',
      label: 'Partite Organizzate',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: '250+',
      label: 'Locali Partner',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      value: '1.500+',
      label: 'Tornei Completati',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4`}
              >
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

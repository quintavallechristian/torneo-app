'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import MyAvatar from '@/components/MyAvatar/MyAvatar';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Marco Rossi',
      role: 'Owner - Il Dado Truccato',
      avatar: 'M',
      content:
        'PartitApp ha trasformato il nostro locale. I clienti adorano il sistema di ranking e siamo passati da 20 a 150 giocatori attivi in soli 3 mesi!',
      rating: 5,
    },
    {
      name: 'Laura Bianchi',
      role: 'Manager - Taverna dei Giochi',
      avatar: 'L',
      content:
        'La modalità presentazione è fantastica! I clienti vedono le classifiche sui nostri schermi e questo crea engagement incredibile. Torneremo mai indietro.',
      rating: 5,
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Organizzatore Tornei',
      avatar: 'G',
      content:
        'Organizzo tornei da anni e PartitApp mi ha semplificato la vita. Gestione automatica, classifiche in tempo reale e zero errori. Semplicemente perfetto.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Amato da locali e giocatori
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scopri cosa dicono i nostri clienti
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <MyAvatar
                    className="size-12"
                    placeholder={testimonial.avatar}
                    isOwn={false}
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

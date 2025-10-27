'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'PartitApp è gratuito?',
      answer:
        'Sì! PartitApp è completamente gratuito per i giocatori. Possono creare un account, partecipare a partite, vedere le classifiche e tracciare le loro statistiche senza alcun costo. I piani a pagamento sono dedicati ai locali che vogliono gestire la loro community.',
    },
    {
      question: 'Come funziona il sistema di ranking?',
      answer:
        'Il ranking si aggiorna automaticamente dopo ogni partita completata. Assegniamo punti in base al risultato, alla difficoltà del gioco e al livello degli avversari. Ci sono classifiche globali, regionali e per singolo locale.',
    },
    {
      question: 'Posso usare PartitApp per partite private con amici?',
      answer:
        'Assolutamente sì! Puoi creare partite private, invitare i tuoi amici e tenere traccia delle statistiche del tuo gruppo. Anche le partite private contribuiscono al tuo ranking personale.',
    },
    {
      question: 'Come posso aggiungere il mio locale?',
      answer:
        "Se sei il proprietario di un locale, puoi registrarti e richiedere l'aggiunta del tuo locale. Ti contatteremo per verificare i dettagli e attivare il tuo profilo business.",
    },
    {
      question: 'Posso importare i miei giochi da BoardGameGeek?',
      answer:
        'Sì! Con la sincronizzazione BGG puoi importare automaticamente la tua collezione di giochi da BoardGameGeek, incluse tutte le informazioni e immagini.',
    },
    {
      question: 'Come funziona la prova gratuita di 30 giorni?',
      answer:
        'I locali possono provare qualsiasi piano Pro o Premium gratuitamente per 30 giorni, senza inserire carta di credito. Al termine del periodo di prova, potrai decidere se continuare con un abbonamento.',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Domande Frequenti
          </h2>
          <p className="text-xl text-muted-foreground">
            Tutto quello che devi sapere su PartitApp
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-2 hover:border-indigo-500 transition-all cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

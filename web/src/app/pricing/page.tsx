import PricingTable from '@/components/PricingTable/PricingTable';
import Footer from '@/components/Footer/Footer';
import CTASection from '@/components/CTASection/CTASection';
import { Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Header della pagina pricing */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Piani e Prezzi
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Scegli il piano perfetto
            <br />
            per la tua attività
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Piani flessibili per giocatori singoli e locali di ogni dimensione.
            Prova gratuitamente per 30 giorni, senza carta di credito.
          </p>
        </div>
      </section>

      {/* Tabella prezzi */}
      <PricingTable />

      {/* FAQ specifiche per pricing */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Domande sui prezzi
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Posso cambiare piano in qualsiasi momento?
              </h3>
              <p className="text-muted-foreground">
                Sì, puoi passare a un piano superiore o inferiore in qualsiasi
                momento. Gli addebiti saranno ripartiti proporzionalmente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Cosa succede al termine della prova gratuita?
              </h3>
              <p className="text-muted-foreground">
                Al termine dei 30 giorni, potrai decidere se attivare un
                abbonamento. Non verrà addebitato nulla automaticamente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Ci sono costi aggiuntivi nascosti?
              </h3>
              <p className="text-muted-foreground">
                No, i prezzi che vedi sono tutto incluso. Non ci sono costi di
                setup, commissioni sulle transazioni o costi nascosti.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Offrite sconti per organizzazioni non profit?
              </h3>
              <p className="text-muted-foreground">
                Sì! Contattaci a info@partitapp.com per discutere di sconti
                speciali per organizzazioni non profit e associazioni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

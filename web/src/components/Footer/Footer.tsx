'use client';

import Link from 'next/link';
import { DicesIcon, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrizione */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <DicesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold">PartitApp</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La piattaforma completa per gestire partite, tornei e classifiche.
            </p>
          </div>

          {/* Prodotto */}
          <div>
            <h3 className="font-semibold mb-4">Prodotto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Funzionalità
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prezzi
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partite
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Giochi
                </Link>
              </li>
              <li>
                <Link
                  href="/places"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Luoghi
                </Link>
              </li>
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h3 className="font-semibold mb-4">Risorse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Registrati
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accedi
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@partitapp.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +39 123 456 7890
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Milano, Italia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 PartitApp. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Termini di Servizio
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import * as React from 'react';
import { Menu } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Profile, ROLE } from '@/types';

export function MobileMenuButton({
  profile,
  role,
}: {
  profile: Profile | null;
  role: ROLE | null;
}) {
  const [open, setOpen] = React.useState(false);

  const matchesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Partite',
      href: '/matches',
      description: 'Lista di tutte le partite presenti nel database di Torneo.',
    },
    profile && {
      title: 'Mie partite',
      href: '/matches/mine',
      description:
        'Lista di tutte le partite a cui partecipi o hai partecipato',
    },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  const gamesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Giochi',
      href: '/games',
      description: 'Lista di tutti i giochi presenti nel database di Torneo.',
    },
    profile && {
      title: 'Preferiti',
      href: '/games/favourites',
      description: 'Lista dei tuoi giochi preferiti.',
    },
    profile && {
      title: 'Collezione',
      href: '/games/collection',
      description: 'Lista dei tuoi giochi in collezione.',
    },
    profile && {
      title: 'Desiderati',
      href: '/games/wishlist',
      description: 'Lista dei tuoi giochi desiderati.',
    },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  const placesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Luoghi',
      href: '/places',
      description: 'Lista di tutti i luoghi presenti nel database.',
    },
    profile && {
      title: 'Preferiti',
      href: '/places/favourites',
      description: 'Lista di tutti i tuoi luoghi preferiti.',
    },
    profile &&
      role !== ROLE.User && {
        title: 'Gestiti',
        href: '/places/managed',
        description: 'Lista di tutti i tuoi luoghi gestiti.',
      },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>PartitApp</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 overflow-y-auto flex-1">
          <MobileMenuSection
            title="Partite"
            items={matchesItems}
            setOpen={setOpen}
          />
          <MobileMenuSection
            title="Giochi"
            items={gamesItems}
            setOpen={setOpen}
          />
          <MobileMenuSection
            title="Luoghi"
            items={placesItems}
            setOpen={setOpen}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function MyNavigationMenu({
  profile,
  role,
}: {
  profile: Profile | null;
  role: ROLE | null;
}) {
  const matchesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Partite',
      href: '/matches',
      description: 'Lista di tutte le partite presenti nel database di Torneo.',
    },
    profile && {
      title: 'Mie partite',
      href: '/matches/mine',
      description:
        'Lista di tutte le partite a cui partecipi o hai partecipato',
    },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  const gamesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Giochi',
      href: '/games',
      description: 'Lista di tutti i giochi presenti nel database di Torneo.',
    },
    profile && {
      title: 'Preferiti',
      href: '/games/favourites',
      description: 'Lista dei tuoi giochi preferiti.',
    },
    profile && {
      title: 'Collezione',
      href: '/games/collection',
      description: 'Lista dei tuoi giochi in collezione.',
    },
    profile && {
      title: 'Desiderati',
      href: '/games/wishlist',
      description: 'Lista dei tuoi giochi desiderati.',
    },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  const placesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Luoghi',
      href: '/places',
      description: 'Lista di tutti i luoghi presenti nel database.',
    },
    profile && {
      title: 'Preferiti',
      href: '/places/favourites',
      description: 'Lista di tutti i tuoi luoghi preferiti.',
    },
    profile &&
      role !== ROLE.User && {
        title: 'Gestiti',
        href: '/places/managed',
        description: 'Lista di tutti i tuoi luoghi gestiti.',
      },
  ].filter(Boolean) as { title: string; href: string; description: string }[];

  return (
    <NavigationMenu viewport={false} className="z-50 hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Partite
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {matchesItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Giochi
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {gamesItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Luoghi
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {placesItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileMenuSection({
  title,
  items,
  setOpen,
}: {
  title: string;
  items: { title: string; href: string; description: string }[];
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="space-y-3 p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="font-medium text-sm">{item.title}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

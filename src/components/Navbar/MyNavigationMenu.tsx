'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Profile } from '@/types';

export function MyNavigationMenu({ profile }: { profile: Profile | null }) {
  const matchesItems: { title: string; href: string; description: string }[] = [
    {
      title: 'Partite',
      href: '/matches',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
  ];

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
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
  ];

  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Partite</NavigationMenuTrigger>
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
          <NavigationMenuTrigger>Giochi</NavigationMenuTrigger>
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
          <NavigationMenuTrigger>Luoghi</NavigationMenuTrigger>
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

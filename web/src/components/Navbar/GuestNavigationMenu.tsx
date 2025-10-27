'use client';

import Link from 'next/link';
import * as React from 'react';
import { Menu } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MobileMenuSection } from './MobileMenuSection';

export function MobileGuestMenuButton() {
  const [open, setOpen] = React.useState(false);

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
            title="Funzionalità"
            titleHref="/#features"
            setOpen={setOpen}
          />
          <MobileMenuSection
            title="Prezzi"
            titleHref="/pricing"
            setOpen={setOpen}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function GuestNavigationMenu() {
  return (
    <NavigationMenu viewport={false} className="z-50 hidden md:flex">
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <Link href="#features">Funzionalità</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing">Prezzi</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

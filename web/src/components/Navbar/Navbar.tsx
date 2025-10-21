import { redirect } from 'next/navigation';
import { ModeToggle } from './ModeToggle';
import { createClient } from '@/utils/supabase/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { MyNavigationMenu, MobileMenuButton } from './MyNavigationMenu';
import { ROLE } from '@/types';
import { Button } from '../ui/button';

async function handleLogout() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export default async function Navbar() {
  const { profile, role } = await getAuthenticatedUserWithProfile();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <MobileMenuButton profile={profile} role={role} />
        <Link href="/">Logo</Link>
      </div>
      <MyNavigationMenu profile={profile} role={role} />
      <div className="flex items-center gap-4">
        {profile ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className={`cursor-pointer text-sm font-medium mr-4 ${
                    role === ROLE.Admin
                      ? 'text-red-300'
                      : role === ROLE.User
                      ? 'text-blue-300'
                      : 'text-green-300'
                  }`}
                >
                  {profile.username}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                  <Link href="/profile">My Account</Link>
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/profile/edit">Impostazioni</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={handleLogout}>
                    <button type="submit">Log out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

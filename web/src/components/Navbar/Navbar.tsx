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
import { ROLE } from '@/types';
import { Button } from '../ui/button';
import {
  DicesIcon,
  LogOut,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import {
  GuestNavigationMenu,
  MobileGuestMenuButton,
} from './GuestNavigationMenu';
import {
  LoggedNavigationMenu,
  MobileLoggedMenuButton,
} from './LoggedNavigationMenu';
import MyAvatar from '../MyAvatar/MyAvatar';

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
        {profile ? (
          <MobileLoggedMenuButton profile={profile} role={role} />
        ) : (
          <MobileGuestMenuButton />
        )}
        <Link href="/" className="flex items-center gap-2">
          <DicesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold">PartitApp</span>
        </Link>
      </div>
      {profile ? (
        <LoggedNavigationMenu profile={profile} role={role} />
      ) : (
        <GuestNavigationMenu />
      )}
      <div className="flex items-center gap-4">
        {profile ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2  mr-2">
                  <div
                    className={`cursor-pointer text-sm font-medium ${
                      role === ROLE.Admin
                        ? 'text-red-300'
                        : role === ROLE.User
                        ? 'text-blue-300'
                        : 'text-green-300'
                    }`}
                  >
                    {profile.username}
                  </div>
                  <MyAvatar
                    className="size-8 text-3xl"
                    isOwn={true}
                    image={profile?.image}
                    placeholder={profile?.username.charAt(0)}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <UserIcon className="size-4" />
                  <Link href="/profile">My Account</Link>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <SettingsIcon className="size-4" />
                  <Link href="/settings">Impostazioni</Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <LogOut className="size-4" />
                  <form action={handleLogout}>
                    <button type="submit">Log out</button>
                  </form>
                </DropdownMenuLabel>
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

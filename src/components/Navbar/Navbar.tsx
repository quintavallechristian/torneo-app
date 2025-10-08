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
import { MyNavigationMenu } from './MyNavigationMenu';

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
      <div>
        <Link href="/">Logo</Link>
      </div>
      <MyNavigationMenu />
      <div className="flex items-center gap-4">
        {profile ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className={`cursor-pointer text-sm font-medium mr-4 ${
                    role === ROLE.Admin ? 'text-red-300' : 'text-blue-300'
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
                  <DropdownMenuItem>Settings</DropdownMenuItem>
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
          <div>
            <Link href="/login">Login</Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

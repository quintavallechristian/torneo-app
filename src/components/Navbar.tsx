import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { createClient } from '@/utils/supabase/server'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';

async function handleLogout() {
  'use server'
  const supabase = await createClient()
    await supabase.auth.signOut();
    redirect('/login');
  }

export default async function Navbar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()

  let profile = null;
  if(data.user) {
    const { data: fetchedProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    profile = fetchedProfile;
  }
  

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <Link href="/">Logo</Link>
      </div>
      <div>
        <Link href="/tournaments" className="mr-4 hover:underline">Tornei</Link>
        <Link href="/games" className="mr-4 hover:underline">Giochi</Link>
      </div>
      <div className="flex items-center gap-4">
        {profile ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer text-sm font-medium mr-4">{profile.firstname}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={handleLogout}>
                    <button type="submit">
                      Log out
                    </button>
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
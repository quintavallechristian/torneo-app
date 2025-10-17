'use client';

import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export async function deleteMatch(matchId: string) {
  const { data, error } = await supabase
    .from('matches')
    .delete()
    .eq('id', matchId);

  if (error) {
    console.error('Error deleting match:', error);
  } else {
    console.log('match deleted successfully:', data);
    redirect('/matches');
  }
}

export default function MyAvatar({
  isOwn,
  image,
  placeholder,
  className,
}: {
  isOwn: boolean;
  image?: string | null;
  placeholder: string;
  className?: string;
}) {
  return (
    <Avatar
      className={`${isOwn ? 'border-emerald-500' : ''} ${
        className ? className : 'size-8'
      }`}
    >
      {image ? (
        <AvatarImage src={image} />
      ) : (
        <AvatarFallback
          className={`uppercase border-1 text-white bg-indigo-800`}
        >
          {placeholder}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

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

// Mappa ogni lettera dell'alfabeto a un colore
const letterColorMap: { [key: string]: string } = {
  A: 'bg-red-600',
  B: 'bg-orange-600',
  C: 'bg-amber-600',
  D: 'bg-yellow-600',
  E: 'bg-lime-600',
  F: 'bg-green-600',
  G: 'bg-emerald-600',
  H: 'bg-teal-600',
  I: 'bg-cyan-600',
  J: 'bg-sky-600',
  K: 'bg-blue-600',
  L: 'bg-indigo-600',
  M: 'bg-violet-600',
  N: 'bg-purple-600',
  O: 'bg-fuchsia-600',
  P: 'bg-pink-600',
  Q: 'bg-rose-600',
  R: 'bg-red-700',
  S: 'bg-orange-700',
  T: 'bg-amber-700',
  U: 'bg-green-700',
  V: 'bg-teal-700',
  W: 'bg-blue-700',
  X: 'bg-indigo-700',
  Y: 'bg-purple-700',
  Z: 'bg-pink-700',
};

function getColorForLetter(letter: string): string {
  const firstLetter = letter.charAt(0).toUpperCase();
  return letterColorMap[firstLetter] || 'bg-indigo-800';
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
  const avatarColor = getColorForLetter(placeholder);

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
          className={`uppercase border-1 text-white ${avatarColor}`}
        >
          {placeholder}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

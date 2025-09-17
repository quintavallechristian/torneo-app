
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server'

export default async function GamesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('games').select('*').limit(10);
  console.log(data);
  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <h1 className='text-2xl font-bold mb-4'>Giochi</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(game => (
          <TableRow key={game.id}>
            <TableCell>{game.name}</TableCell>
            <TableCell className="text-right">
              <Link href={`/games/${game.id}`} className='text-foreground hover:underline'>
                <EyeIcon className='inline mr-2 h-4 w-4' />
                Dettagli
              </Link>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
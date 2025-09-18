
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
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server'

export default async function TournamentsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('tournaments').select('*');
  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <h1 className='text-2xl font-bold mb-4'>Tornei</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Data inizio</TableHead>
            <TableHead>Data fine</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(tournament => (
          <TableRow key={tournament.id}>
            <TableCell>{tournament.name}</TableCell>
            <TableCell>{tournament.game}</TableCell>
            <TableCell>{tournament.startAt}</TableCell>
            <TableCell>{tournament.endAt}</TableCell>
            <TableCell className="text-right">
              <Link href={`/tournaments/${tournament.id}`} className='text-foreground hover:underline'>
                <EyeIcon className='inline mr-2 h-4 w-4' />
                Dettagli
              </Link>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className='mt-4' asChild>
        <Link href="/tournaments/new">Crea nuovo torneo</Link>
      </Button>
    </div>
  );
}
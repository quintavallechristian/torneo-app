'use server';
import { createClient } from '@/utils/supabase/server';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrophyIcon,
  UsersIcon,
  DicesIcon,
  TargetIcon,
  TrendingUpIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Match, MATCHSTATUS, PlaceStats as PlaceStatsType } from '@/types';
import { getMatchStatus } from '@/lib/client/match';

interface PlaceStatsProps {
  placeId: number;
}

interface GameWithStats {
  game_id: string;
  game_name: string;
  game_image: string | null;
  total_matches: number;
  unique_players: number;
}

export default async function PlaceStats({ placeId }: PlaceStatsProps) {
  const supabase = await createClient();

  // Get overall statistics
  const { data } = await supabase
    .from('matches')
    .select(
      `
      *,
      players:profiles_matches(
        profile_id,
        confirmed
      ),
      game:games(id, name, image)
    `,
    )
    .eq('place_id', placeId);

  const matches = data as Match[] | null;

  // Get player statistics
  const { data: playersStatsData } = await supabase
    .from('profiles_places')
    .select(
      `
      profile_id,
      points,
      win,
      loss,
      draw,
      minutes_played,
      profile:profiles(id, username, image, bgg_username, image, firstname, lastname)
    `,
    )
    .eq('place_id', placeId)
    .order('points', { ascending: false })
    .limit(10);

  const playersStats: PlaceStatsType[] =
    (playersStatsData as unknown as PlaceStatsType[]) || [];

  const totalMatches = matches?.length || 0;
  const completedMatches =
    matches?.filter((m) => getMatchStatus(m) === MATCHSTATUS.Completed)
      .length || 0;
  const totalPlayers = new Set(
    matches?.flatMap(
      (m) =>
        m.players?.filter((p) => p.confirmed).map((p) => p.profile_id) || [],
    ),
  ).size;

  // Get unique games with stats
  const gamesMap = new Map<string, GameWithStats>();
  matches?.forEach((match) => {
    if (match.game && !Array.isArray(match.game)) {
      const game = match.game as { id: any; name: any; image: any };
      const gameId = String(game.id);
      const existing = gamesMap.get(gameId);
      const confirmedPlayers = match.players?.filter((p) => p.confirmed) || [];

      if (existing) {
        existing.total_matches++;
        existing.unique_players = Math.max(
          existing.unique_players,
          confirmedPlayers.length,
        );
      } else {
        gamesMap.set(gameId, {
          game_id: gameId,
          game_name: game.name || 'Gioco sconosciuto',
          game_image: game.image,
          total_matches: 1,
          unique_players: confirmedPlayers.length,
        });
      }
    }
  });

  const topGames = Array.from(gamesMap.values())
    .sort((a, b) => b.unique_players - a.unique_players)
    .slice(0, 5);

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMatches =
    matches?.filter((m) => new Date(m.startAt) > sevenDaysAgo).length || 0;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpotlightCard className="p-6" spotlightColor="rgba(99, 102, 241, 0.2)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Partite Totali
              </p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalMatches}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {completedMatches} completate
              </p>
            </div>
            <DicesIcon className="h-12 w-12 text-indigo-500 opacity-50" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.2)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Giocatori Unici
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {totalPlayers}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                hanno giocato qui
              </p>
            </div>
            <UsersIcon className="h-12 w-12 text-green-500 opacity-50" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(234, 179, 8, 0.2)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Giochi Diversi
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {gamesMap.size}
              </p>
              <p className="text-xs text-muted-foreground mt-1">giocati qui</p>
            </div>
            <TargetIcon className="h-12 w-12 text-yellow-500 opacity-50" />
          </div>
        </SpotlightCard>
      </div>

      {/* Activity Section */}
      <SpotlightCard className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUpIcon className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Attività Recente</h2>
            <p className="text-sm text-muted-foreground">Ultimi 7 giorni</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {recentMatches}
          </span>
          <span className="text-muted-foreground">
            partite giocate questa settimana
          </span>
        </div>
      </SpotlightCard>

      {/* Top Games Section */}
      <SpotlightCard className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <DicesIcon className="h-6 w-6 text-purple-500" />
          <h2 className="text-xl font-semibold">Giochi Più Giocati</h2>
        </div>

        {topGames.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nessun dato disponibile
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topGames.map((game, index) => (
              <Link
                key={game.game_id}
                href={`/games/${game.game_id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {game.game_image && (
                        <img
                          src={game.game_image}
                          alt={game.game_name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-2">
                          {game.game_name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          #{index + 1} più giocato
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Partite:</span>
                        <Badge variant="secondary">{game.total_matches}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Giocatori:
                        </span>
                        <Badge variant="secondary">{game.unique_players}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </SpotlightCard>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <UsersIcon className="h-5 w-5 text-violet-500" />
            <h3 className="font-semibold">Media Giocatori</h3>
          </div>
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
            {totalMatches > 0
              ? Math.round(
                  matches!.reduce(
                    (acc, m) =>
                      acc + (m.players?.filter((p) => p.confirmed).length || 0),
                    0,
                  ) / totalMatches,
                )
              : 0}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            giocatori per partita
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrophyIcon className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Tasso Completamento</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {totalMatches > 0
              ? Math.round((completedMatches / totalMatches) * 100)
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            delle partite completate
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

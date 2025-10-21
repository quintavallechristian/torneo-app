import { createClient } from '@/utils/supabase/server';
import StatsExagon, { StatsExagonSize } from '../StatsExagon/StatsExagon';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { BadgeVariant } from '../ui/exagonalBadge';

interface StatsExagonProps {
  size?: StatsExagonSize;
  hideLabels?: boolean;
}
export default async function StatsShowcase({
  size = 'lg',
  hideLabels = false,
}: StatsExagonProps) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile) {
    return null;
  }
  const supabase = await createClient();
  // Fetch user statistics
  const { data: allProfileGames } = await supabase
    .from('profiles_games')
    .select('*')
    .eq('profile_id', profile.id);

  const { data: allProfilePlaces } = await supabase
    .from('profiles_places')
    .select('*')
    .eq('profile_id', profile.id);

  const gamesInCollection =
    allProfileGames?.filter((game) => game.in_collection)?.length || 0;
  const totalPlaces = allProfilePlaces?.length || 0;
  const highestGameElo =
    allProfileGames?.find(
      (game) =>
        game.points === Math.max(...allProfileGames.map((g) => g?.points || 0)),
    )?.points || 0;
  const totalWins =
    allProfileGames?.reduce((sum, game) => sum + (game.win || 0), 0) || 0;
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
      <StatsExagon
        hideLabel={hideLabels}
        size={size}
        stat={highestGameElo}
        label="MAX ELO"
        withShadow
      />
      <StatsExagon
        hideLabel={hideLabels}
        size={size}
        stat={totalWins}
        label="Partite vinte"
        variant={BadgeVariant.amber}
        withShadow
      />
      <StatsExagon
        hideLabel={hideLabels}
        size={size}
        stat={gamesInCollection}
        label="Collezione"
        variant={BadgeVariant.blue}
        withShadow
      />
      <StatsExagon
        hideLabel={hideLabels}
        size={size}
        stat={totalPlaces}
        label="Luoghi visti"
        variant={BadgeVariant.red}
        withShadow
      />
      <StatsExagon
        hideLabel={hideLabels}
        size={size}
        stat={totalPlaces}
        label="Giocati"
        variant={BadgeVariant.red}
        withShadow
      />
    </div>
  );
}

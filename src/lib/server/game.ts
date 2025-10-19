'use server';
import { Game, GAME_STATS_STATE, GameStats } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { parseStringPromise } from 'xml2js';
import { isBefore, subDays } from 'date-fns';
import { decode } from 'html-entities';

export async function getGameRanking(GameId?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_games')
    .select('*, profile:profiles(*)')
    .eq('game_id', GameId)
    .gt('points', 0)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as GameStats[];
}

export async function getGames(
  query: string,
  filterBy: GAME_STATS_STATE | null = null,
): Promise<Game[]> {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();

  if (!profile) {
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('bgg_rank')
      .limit(100);
    return data ?? [];
  } else if (filterBy !== null) {
    const { data } = await supabase
      .from('games')
      .select(
        '*, gameStats:profiles_games!inner(profile_id, favourite, in_collection, in_wishlist, rating)',
      )
      .eq('gameStats.profile_id', profile.id)
      .eq(`gameStats.${filterBy}`, true)
      .ilike('name', `%${query}%`)
      .order('bgg_rank')
      .limit(100);
    return data ?? [];
  } else {
    const { data } = await supabase
      .from('games')
      .select(
        '*, gameStats:profiles_games(profile_id, favourite, in_collection, in_wishlist, rating)',
      )
      .eq('gameStats.profile_id', profile.id)
      .or('bgg_rank.neq.-1,bgg_rank.is.null')
      .ilike('name', `%${query}%`)
      .order('bgg_rank', { ascending: true, nullsFirst: false })
      .order('bgg_rating', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(26);
    return data ?? [];
  }
}

export async function setFavouriteGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      favourite: status,
    },
    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function setInCollectionGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      in_collection: status,
    },

    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function setInWishlistGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      in_wishlist: status,
    },

    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function getGame(gameId: string) {
  const supabase = await createClient();
  let game, error;
  if (!isNaN(Number(gameId))) {
    const result = await supabase
      .from('games')
      .select(
        `
            *, 
            matches:matches(*, 
            game:games(name, image, id), 
            place:places(name, id),
            winner:profiles(*), players:profiles_matches(*, profile:profiles(*))
            ),
            gameStats:profiles_games(profile_id, favourite, in_collection, in_wishlist, rating),
            gamePlaces:places_games(game_id, place:places(name, id))
            `,
      )
      .eq('id', gameId)
      .single<Game>();
    game = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('games')
      .select('*, gamePlaces:places_games(game_id, place:places(name, id))')
      .eq('name', gameId)
      .single<Game>();
    game = result.data;
    error = result.error;
  }
  console.log('fetched', game);
  return { game, error };
}

export async function updateGame(game: Game): Promise<Game> {
  const supabase = await createClient();
  const updateAt = game.updated_at;
  let gameDescription = decode(game.description);
  let image = game.image;
  let thumbnail = game.thumbnail;
  let min_players = game.min_players;
  let max_players = game.max_players;
  let min_playtime = game.min_playtime;
  let max_playtime = game.max_playtime;
  let year_published = game.year_published;
  let age = game.age;
  let designer = game.designer;
  let bgg_rating = game.bgg_rating;
  let bgg_weight = game.bgg_weight;
  const bgg_rank = game.bgg_rank;

  // Se la descrizione non esiste, la recuperiamo dall'API esterna e la salviamo nel database
  if (!updateAt || isBefore(updateAt, subDays(Date.now(), 30))) {
    console.log('chiamata bgg per gioco: ' + game.name + ' - ' + game.id);
    try {
      const response = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1`,
      );
      const xmlData = await response.text();

      const parsedData = await parseStringPromise(xmlData);

      gameDescription = parsedData?.items?.item?.[0].description?.[0] || '';
      image = parsedData?.items?.item?.[0].image?.[0] || '';
      thumbnail = parsedData?.items?.item?.[0].thumbnail?.[0] || '';
      min_players = parsedData?.items?.item?.[0].minplayers?.[0].$.value || 0;
      max_players = parsedData?.items?.item?.[0].maxplayers?.[0].$.value || 0;
      min_playtime =
        parsedData?.items?.item?.[0].minplaytime?.[0].$.value || null;
      max_playtime =
        parsedData?.items?.item?.[0].maxplaytime?.[0].$.value || null;
      year_published =
        parsedData?.items?.item?.[0].yearpublished?.[0].$.value || null;
      age = parsedData?.items?.item?.[0].minage?.[0].$.value || null;
      designer =
        parsedData?.items?.item?.[0].link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.filter((link: any) => link?.$.type === 'boardgamedesigner')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((link: any) => link?.$.value)
          .join(', ') || null;

      bgg_rating = parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]
        ?.average?.[0].$.value
        ? Math.round(
            parseFloat(
              parsedData.items.item[0].statistics[0].ratings[0].average[0].$
                .value,
            ) * 100,
          ) / 100
        : null;

      bgg_weight = parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]
        ?.averageweight?.[0].$.value
        ? Math.round(
            parseFloat(
              parsedData.items.item[0].statistics[0].ratings[0].averageweight[0]
                .$.value,
            ) * 100,
          ) / 100
        : null;

      const retrieved_bgg_rank =
        parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]?.ranks?.[0].rank.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => r?.$.name === 'boardgame',
        )?.$.value || null;

      gameDescription = decode(gameDescription.replace(/<br\s*\/?>/gi, '\n'));

      const { error: updateError } = await supabase
        .from('games')
        .update({
          description: gameDescription,
          min_players,
          max_players,
          image,
          thumbnail,
          year_published,
          designer,
          min_playtime,
          max_playtime,
          age,
          bgg_rating,
          bgg_weight,
          bgg_rank:
            retrieved_bgg_rank === 'Not Ranked' ? -1 : retrieved_bgg_rank,
          updated_at: new Date(),
        })
        .eq('id', game.id);

      if (updateError) {
        console.error(
          "Errore nell'aggiornamento della descrizione:",
          updateError,
          bgg_rank,
        );
      }
    } catch (apiError) {
      console.error(
        "Errore nel recupero della descrizione dall'API:",
        apiError,
      );
    }
  }
  return {
    id: game.id,
    name: game.name,
    updated_at: game.updated_at,
    description: gameDescription,
    image,
    thumbnail,
    min_players,
    max_players,
    min_playtime,
    max_playtime,
    year_published,
    age,
    designer,
    bgg_rating,
    bgg_weight,
    bgg_rank,
  };
}

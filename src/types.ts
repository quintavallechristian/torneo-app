import z from 'zod';
export enum UserAction {
  ManagePlatform = 'manage:platform',
  ManagePlaces = 'manage:places',
  ManageGames = 'manage:games',
  CreateMatches = 'create:matches',
  DeleteMatches = 'delete:matches',
  UpdateMatches = 'update:matches',
  ReadPlaces = 'read:places',
  CreatePlaces = 'create:places',
  DeletePlaces = 'delete:places',
  UpdatePlaces = 'update:places',
}

export enum ROLE {
  Admin = 'Admin',
  User = 'User',
  PlaceManager = 'PlaceManager',
  GameManager = 'GameManager',
}

export type SearchParams = {
  q?: string;
};

export enum SCOPE {
  Place = 'place',
  Game = 'game',
  Match = 'match',
}

export enum GAME_STATS_STATE {
  InCollection = 'in_collection',
  Favourite = 'favourite',
  InWishlist = 'in_wishlist',
}

export enum MATCHSTATUS {
  Scheduled = 'Scheduled',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
  Canceled = 'Canceled',
  WaitingForResults = 'WaitingForResults',
}

export const createMatchSchema = (minPlayers: number, maxPlayers: number) =>
  z.object({
    name: z
      .string()
      .min(3, 'Nome partita troppo corto')
      .max(100, 'Nome partita troppo lungo'),
    game_id: z.string().min(1, 'Devi selezionare un gioco'),
    place_id: z.string().min(1, 'Devi selezionare un luogo'),
    description: z.string().max(500, 'Descrizione troppo lunga').optional(),
    startAt: z.string().min(1, 'Devi selezionare una data di inizio'),
    endAt: z.string().min(1, 'Devi selezionare una data di fine'),
    min_players: z
      .number()
      .min(minPlayers, `Numero minimo di giocatori è ${minPlayers}`),
    max_players: z
      .number()
      .max(maxPlayers, `Numero massimo di giocatori è ${maxPlayers}`),
  });

export const PlaceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(100),
  image: z.string().nullable(),
  description: z.string().min(3).max(2000).nullable(),
  address: z.string().min(3).max(2000),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const ProfileSchema = z.object({
  username: z.string().min(3).max(30),
  image: z.string().url().nullable(),
  firstname: z.string().min(1).max(50).nullable(),
  lastname: z.string().min(1).max(50).nullable(),
});

export type UserRowPermission = {
  id: number;
  place_id: string;
  permission: { action: UserAction };
};

export type UserPermission = {
  placeId?: string;
  gameId?: string;
  matchId?: string;
  action: UserAction;
};

// extract the inferred type
export type Profile = z.infer<typeof ProfileSchema> & {
  id: string;
  role: ROLE;
  matches?: Match[];
};

export type Game = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  min_players: number | null;
  max_players: number | null;
  min_playtime: number | null;
  max_playtime: number | null;
  year_published: number | null;
  age: number | null;
  designer: string | null;
  bgg_rating: number | null;
  bgg_weight: number | null;
  bgg_rank: number | null;
  updated_at: string | null;
  thumbnail: string | null;
  matches?: Match[];
  gameStats?: GameStats[];
};
export type Place = z.infer<typeof PlaceSchema> & {
  matches?: Match[];
  placeStats?: PlaceStats[];
};
export type Match = z.infer<ReturnType<typeof createMatchSchema>> & {
  id?: string;
  status?: MATCHSTATUS;
  game?: Game;
  place?: Place;
  players?: Player[];
  winner?: Profile | null;
};

export type Player = {
  id: string;
  created_at: string;
  profile_id: string;
  match_id: string;
  profile: Profile;
  points: number;
  confirmed?: boolean | null;
};

export type PlayerStats = Player & {
  id: string;
  created_at: string;
  profile_id: string;
  profile: Profile;
  points: number;
  win: number;
  loss: number;
  draw: number;
  minutes_played: number;
};

export type GameStats = PlayerStats & {
  game_id: string;
  in_collection: boolean;
  in_wishlist: boolean;
  rating: number | null;
  favourite: boolean;
};
export type PlaceStats = PlayerStats & {
  place_id: string;
  favourite: boolean;
};

export type PlaceGame = {
  place_id: string;
  game: Pick<Game, 'id' | 'name' | 'min_players' | 'max_players'>[];
};

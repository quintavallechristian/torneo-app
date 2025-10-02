import z from 'zod';

export enum ROLE {
  Admin = 'Admin',
  User = 'User',
  Moderator = 'Moderator',
  PlaceAdmin = 'PlaceAdmin',
  PlaceModerator = 'PlaceModerator',
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
    location_id: z.string().min(1, 'Devi selezionare un luogo'),
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

export const ProfileSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3).max(30),
  image: z.string().url().nullable(),
  role: z.nativeEnum(ROLE).default(ROLE.User),
  firstname: z.string().min(1).max(50).nullable(),
  lastname: z.string().min(1).max(50).nullable(),
});

// extract the inferred type
export type Profile = z.infer<typeof ProfileSchema> & {
  matches?: Match[];
};

export type Player = {
  id: string;
  points: number | null;
  profile: Profile | null;
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
};
export type Location = {
  id: string;
  name: string;
  image: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  matches?: Match[];
};
export type Match = z.infer<ReturnType<typeof createMatchSchema>> & {
  id?: string;
  game?: Game;
  location?: Location;
  players?: Player[];
  winner?: Profile | null;
};

interface Stats {
  id: number;
  created_at: string;
  profile_id: number;
  points: number;
  game_id: number;
  win: number;
  loss: number;
  draw: number;
  minutes_played: number;
}

export type GameStats = Stats;
export type LocationStats = Stats;

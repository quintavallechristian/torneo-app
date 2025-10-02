export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      games: {
        Row: {
          age: number | null
          bgg_rank: number | null
          bgg_rating: number | null
          bgg_weight: number | null
          created_at: string
          description: string | null
          designer: string | null
          id: number
          image: string | null
          max_players: number | null
          max_playtime: number | null
          min_players: number | null
          min_playtime: number | null
          name: string | null
          playing_time: number | null
          thumbnail: string | null
          updated_at: string | null
          year_published: number | null
        }
        Insert: {
          age?: number | null
          bgg_rank?: number | null
          bgg_rating?: number | null
          bgg_weight?: number | null
          created_at?: string
          description?: string | null
          designer?: string | null
          id?: number
          image?: string | null
          max_players?: number | null
          max_playtime?: number | null
          min_players?: number | null
          min_playtime?: number | null
          name?: string | null
          playing_time?: number | null
          thumbnail?: string | null
          updated_at?: string | null
          year_published?: number | null
        }
        Update: {
          age?: number | null
          bgg_rank?: number | null
          bgg_rating?: number | null
          bgg_weight?: number | null
          created_at?: string
          description?: string | null
          designer?: string | null
          id?: number
          image?: string | null
          max_players?: number | null
          max_playtime?: number | null
          min_players?: number | null
          min_playtime?: number | null
          name?: string | null
          playing_time?: number | null
          thumbnail?: string | null
          updated_at?: string | null
          year_published?: number | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: number
          image: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          description: string | null
          endAt: string | null
          game_id: number | null
          id: number
          location_id: number | null
          max_players: number | null
          min_players: number | null
          name: string | null
          startAt: string | null
          winner_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          endAt?: string | null
          game_id?: number | null
          id?: number
          location_id?: number | null
          max_players?: number | null
          min_players?: number | null
          name?: string | null
          startAt?: string | null
          winner_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          endAt?: string | null
          game_id?: number | null
          id?: number
          location_id?: number | null
          max_players?: number | null
          min_players?: number | null
          name?: string | null
          startAt?: string | null
          winner_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birthday: string
          country: string | null
          created_at: string
          firstname: string | null
          id: number
          image: string | null
          lastname: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          birthday: string
          country?: string | null
          created_at?: string
          firstname?: string | null
          id?: number
          image?: string | null
          lastname?: string | null
          user_id?: string
          username?: string | null
        }
        Update: {
          birthday?: string
          country?: string | null
          created_at?: string
          firstname?: string | null
          id?: number
          image?: string | null
          lastname?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      profiles_games: {
        Row: {
          created_at: string
          draw: number
          game_id: number
          id: number
          loss: number
          minutes_played: number
          points: number
          profile_id: number
          win: number
        }
        Insert: {
          created_at?: string
          draw?: number
          game_id: number
          id?: number
          loss?: number
          minutes_played?: number
          points?: number
          profile_id: number
          win?: number
        }
        Update: {
          created_at?: string
          draw?: number
          game_id?: number
          id?: number
          loss?: number
          minutes_played?: number
          points?: number
          profile_id?: number
          win?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_games_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_matches: {
        Row: {
          created_at: string
          id: number
          match_id: number | null
          points: number | null
          profile_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          match_id?: number | null
          points?: number | null
          profile_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          match_id?: number | null
          points?: number | null
          profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_matches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      score_sheets: {
        Row: {
          configuration: Json | null
          created_at: string
          game_id: number | null
          id: number
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_sheets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      users_roles: {
        Row: {
          created_at: string
          id: number
          role_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          role_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          role_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

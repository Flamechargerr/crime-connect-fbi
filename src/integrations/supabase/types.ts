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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      case_criminals: {
        Row: {
          case_id: string
          created_at: string
          criminal_id: string
          role: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          criminal_id: string
          role?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          criminal_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_criminals_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_criminals_criminal_id_fkey"
            columns: ["criminal_id"]
            isOneToOne: false
            referencedRelation: "criminals"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_officer_id: string | null
          case_number: string
          category: string | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          location: string | null
          opened_at: string
          priority: Database["public"]["Enums"]["case_priority"]
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_officer_id?: string | null
          case_number: string
          category?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          opened_at?: string
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_officer_id?: string | null
          case_number?: string
          category?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          opened_at?: string
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_officer_id_fkey"
            columns: ["assigned_officer_id"]
            isOneToOne: false
            referencedRelation: "officers"
            referencedColumns: ["id"]
          },
        ]
      }
      criminals: {
        Row: {
          alias: string | null
          created_at: string
          date_of_birth: string | null
          description: string | null
          full_name: string
          gender: string | null
          id: string
          known_offenses: string[] | null
          last_known_location: string | null
          most_wanted: boolean
          mugshot_url: string | null
          nationality: string | null
          reward_amount: number | null
          status: Database["public"]["Enums"]["criminal_status"]
          threat_level: Database["public"]["Enums"]["threat_level"]
          updated_at: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          full_name: string
          gender?: string | null
          id?: string
          known_offenses?: string[] | null
          last_known_location?: string | null
          most_wanted?: boolean
          mugshot_url?: string | null
          nationality?: string | null
          reward_amount?: number | null
          status?: Database["public"]["Enums"]["criminal_status"]
          threat_level?: Database["public"]["Enums"]["threat_level"]
          updated_at?: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          known_offenses?: string[] | null
          last_known_location?: string | null
          most_wanted?: boolean
          mugshot_url?: string | null
          nationality?: string | null
          reward_amount?: number | null
          status?: Database["public"]["Enums"]["criminal_status"]
          threat_level?: Database["public"]["Enums"]["threat_level"]
          updated_at?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          case_id: string | null
          chain_of_custody: Json | null
          collected_at: string | null
          collected_by: string | null
          created_at: string
          description: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          id: string
          image_url: string | null
          label: string
          storage_location: string | null
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          chain_of_custody?: Json | null
          collected_at?: string | null
          collected_by?: string | null
          created_at?: string
          description?: string | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          id?: string
          image_url?: string | null
          label: string
          storage_location?: string | null
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          chain_of_custody?: Json | null
          collected_at?: string | null
          collected_by?: string | null
          created_at?: string
          description?: string | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          id?: string
          image_url?: string | null
          label?: string
          storage_location?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_collected_by_fkey"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "officers"
            referencedColumns: ["id"]
          },
        ]
      }
      officers: {
        Row: {
          avatar_url: string | null
          badge_number: string
          created_at: string
          division: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          rank: string | null
          status: Database["public"]["Enums"]["officer_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          badge_number: string
          created_at?: string
          division?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          rank?: string | null
          status?: Database["public"]["Enums"]["officer_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          badge_number?: string
          created_at?: string
          division?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          rank?: string | null
          status?: Database["public"]["Enums"]["officer_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_number: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badge_number?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badge_number?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "analyst" | "officer"
      case_priority: "low" | "medium" | "high" | "critical"
      case_status: "open" | "investigating" | "closed" | "cold"
      criminal_status: "at_large" | "in_custody" | "incarcerated" | "deceased"
      evidence_type:
        | "physical"
        | "digital"
        | "biological"
        | "document"
        | "weapon"
        | "other"
      officer_status: "active" | "on_leave" | "inactive"
      threat_level: "low" | "medium" | "high" | "extreme"
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
    Enums: {
      app_role: ["admin", "analyst", "officer"],
      case_priority: ["low", "medium", "high", "critical"],
      case_status: ["open", "investigating", "closed", "cold"],
      criminal_status: ["at_large", "in_custody", "incarcerated", "deceased"],
      evidence_type: [
        "physical",
        "digital",
        "biological",
        "document",
        "weapon",
        "other",
      ],
      officer_status: ["active", "on_leave", "inactive"],
      threat_level: ["low", "medium", "high", "extreme"],
    },
  },
} as const

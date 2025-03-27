export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      case_criminals: {
        Row: {
          case_id: string
          criminal_id: string
        }
        Insert: {
          case_id: string
          criminal_id: string
        }
        Update: {
          case_id?: string
          criminal_id?: string
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
          created_at: string
          description: string
          id: string
          police_station_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          police_station_id?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          police_station_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_police_station_id_fkey"
            columns: ["police_station_id"]
            isOneToOne: false
            referencedRelation: "police_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          created_at: string
          id: string
          judge_name: string
          jurisdiction: string | null
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          judge_name: string
          jurisdiction?: string | null
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          judge_name?: string
          jurisdiction?: string | null
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      criminals: {
        Row: {
          biometric_data: string | null
          created_at: string
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
          middle_name: string | null
          photo: string | null
          updated_at: string
        }
        Insert: {
          biometric_data?: string | null
          created_at?: string
          date_of_birth: string
          first_name: string
          id?: string
          last_name: string
          middle_name?: string | null
          photo?: string | null
          updated_at?: string
        }
        Update: {
          biometric_data?: string | null
          created_at?: string
          date_of_birth?: string
          first_name?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          photo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          case_id: string | null
          created_at: string
          description: string
          id: string
          storage_location: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          description: string
          id?: string
          storage_location: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          description?: string
          id?: string
          storage_location?: string
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
        ]
      }
      officers: {
        Row: {
          badge_number: string
          created_at: string
          department: string | null
          id: string
          name: string
          police_station_id: string | null
          rank: string
          updated_at: string
        }
        Insert: {
          badge_number: string
          created_at?: string
          department?: string | null
          id?: string
          name: string
          police_station_id?: string | null
          rank: string
          updated_at?: string
        }
        Update: {
          badge_number?: string
          created_at?: string
          department?: string | null
          id?: string
          name?: string
          police_station_id?: string | null
          rank?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "officers_police_station_id_fkey"
            columns: ["police_station_id"]
            isOneToOne: false
            referencedRelation: "police_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      police_stations: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          case_id: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      witnesses: {
        Row: {
          case_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          statement: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          statement: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          statement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "witnesses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

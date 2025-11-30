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
      business_units: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_use_cases: {
        Row: {
          bu_id: string | null
          created_at: string | null
          description: string | null
          id: string
          mcp_server_count: number | null
          owner_email: string
          skill_count: number | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bu_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          mcp_server_count?: number | null
          owner_email: string
          skill_count?: number | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bu_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          mcp_server_count?: number | null
          owner_email?: string
          skill_count?: number | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_use_cases_bu_id_fkey"
            columns: ["bu_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_servers: {
        Row: {
          auth_type: string
          bu_id: string
          business_unit: string | null
          business_use_case_id: string
          created_at: string | null
          description: string | null
          endpoint_url: string
          id: string
          last_test_run: string | null
          lifecycle_state: string
          name: string
          owner_email: string
          owner_team: string | null
          product_name: string | null
          tags: string[] | null
          test_status: string | null
          updated_at: string | null
        }
        Insert: {
          auth_type?: string
          bu_id: string
          business_unit?: string | null
          business_use_case_id: string
          created_at?: string | null
          description?: string | null
          endpoint_url: string
          id?: string
          last_test_run?: string | null
          lifecycle_state?: string
          name: string
          owner_email: string
          owner_team?: string | null
          product_name?: string | null
          tags?: string[] | null
          test_status?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_type?: string
          bu_id?: string
          business_unit?: string | null
          business_use_case_id?: string
          created_at?: string | null
          description?: string | null
          endpoint_url?: string
          id?: string
          last_test_run?: string | null
          lifecycle_state?: string
          name?: string
          owner_email?: string
          owner_team?: string | null
          product_name?: string | null
          tags?: string[] | null
          test_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_servers_bu_id_fkey"
            columns: ["bu_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_servers_business_use_case_id_fkey"
            columns: ["business_use_case_id"]
            isOneToOne: false
            referencedRelation: "business_use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          business_unit_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          business_unit_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          business_unit_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_unit_id_fkey"
            columns: ["business_unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      use_case_approvals: {
        Row: {
          action: string
          approver_email: string
          approver_role: string
          comments: string | null
          created_at: string | null
          id: string
          use_case_id: string
        }
        Insert: {
          action: string
          approver_email: string
          approver_role: string
          comments?: string | null
          created_at?: string | null
          id?: string
          use_case_id: string
        }
        Update: {
          action?: string
          approver_email?: string
          approver_role?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "use_case_approvals_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "business_use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_roles: {
        Row: {
          created_at: string | null
          role_id: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          user_profile_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_roles_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          business_unit_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          onboarded: boolean | null
          updated_at: string | null
        }
        Insert: {
          business_unit_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          onboarded?: boolean | null
          updated_at?: string | null
        }
        Update: {
          business_unit_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_business_unit_id_fkey"
            columns: ["business_unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
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

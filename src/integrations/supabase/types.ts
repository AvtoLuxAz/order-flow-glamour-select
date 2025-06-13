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
      appointment_products: {
        Row: {
          amount: number
          appointment_id: number | null
          id: number
          price: number
          product_id: number | null
          quantity: number
          staff_user_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: number | null
          id?: number
          price: number
          product_id?: number | null
          quantity: number
          staff_user_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: number | null
          id?: number
          price?: number
          product_id?: number | null
          quantity?: number
          staff_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_products_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_products_staff_user_id_fkey"
            columns: ["staff_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_services: {
        Row: {
          appointment_id: number | null
          duration: number
          id: number
          price: number
          quantity: number | null
          service_id: number | null
          staff_user_id: string | null
        }
        Insert: {
          appointment_id?: number | null
          duration: number
          id?: number
          price: number
          quantity?: number | null
          service_id?: number | null
          staff_user_id?: string | null
        }
        Update: {
          appointment_id?: number | null
          duration?: number
          id?: number
          price?: number
          quantity?: number | null
          service_id?: number | null
          staff_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_staff_user_id_fkey"
            columns: ["staff_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          cancel_reason: string | null
          created_at: string | null
          customer_user_id: string | null
          end_time: string
          id: number
          notes: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          total: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          cancel_reason?: string | null
          created_at?: string | null
          customer_user_id?: string | null
          end_time: string
          id?: number
          notes?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          cancel_reason?: string | null
          created_at?: string | null
          customer_user_id?: string | null
          end_time?: string
          id?: number
          notes?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_user_id_fkey"
            columns: ["customer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          appointment_json: Json | null
          created_at: string | null
          id: number
          invoice_number: string
          status: string | null
          total_amount: number
        }
        Insert: {
          appointment_json?: Json | null
          created_at?: string | null
          id?: number
          invoice_number: string
          status?: string | null
          total_amount: number
        }
        Update: {
          appointment_json?: Json | null
          created_at?: string | null
          id?: number
          invoice_number?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          details: string | null
          discount: number | null
          how_to_use: string | null
          id: number
          ingredients: string | null
          name: string
          price: number
          stock: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          details?: string | null
          discount?: number | null
          how_to_use?: string | null
          id?: number
          ingredients?: string | null
          name: string
          price: number
          stock: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          details?: string | null
          discount?: number | null
          how_to_use?: string | null
          id?: number
          ingredients?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits: string[] | null
          category_id: number | null
          created_at: string | null
          description: string | null
          discount: number | null
          duration: number
          id: number
          name: string
          price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          benefits?: string[] | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          duration?: number
          id?: number
          name: string
          price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          benefits?: string[] | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          duration?: number
          id?: number
          name?: string
          price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: number
          key: string
          lang: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          lang?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          lang?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password: string
          id: string
          last_name: string | null
          note: string | null
          phone: string
          role: Database["public"]["Enums"]["role_enum"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password: string
          id?: string
          last_name?: string | null
          note?: string | null
          phone: string
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password?: string
          id?: string
          last_name?: string | null
          note?: string | null
          phone?: string
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      staff_with_services_json: {
        Row: {
          positions: Json | null
          user: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_available_staff_by_service_and_date: {
        Args: { service_id: number; check_date: string }
        Returns: {
          user_id: string
          full_name: string
          staff_position: string
          email: string
          phone: string
        }[]
      }
      get_staff_by_service: {
        Args: { service_id: number }
        Returns: {
          user_id: string
          full_name: string
          staff_position: string
          email: string
          phone: string
        }[]
      }
    }
    Enums: {
      appointment_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "in_progress"
        | "no_show"
      gender_enum: "male" | "female" | "other"
      payment_method: "cash" | "card" | "bank"
      role_enum: "customer" | "staff" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "in_progress",
        "no_show",
      ],
      gender_enum: ["male", "female", "other"],
      payment_method: ["cash", "card", "bank"],
      role_enum: ["customer", "staff", "admin", "super_admin"],
    },
  },
} as const

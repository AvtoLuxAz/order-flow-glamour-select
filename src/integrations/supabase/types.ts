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
          amount: number | null
          appointment_id: number | null
          id: number
          price: number | null
          product_id: number | null
          quantity: number | null
          staff_user_id: string | null
        }
        Insert: {
          amount?: number | null
          appointment_id?: number | null
          id?: number
          price?: number | null
          product_id?: number | null
          quantity?: number | null
          staff_user_id?: string | null
        }
        Update: {
          amount?: number | null
          appointment_id?: number | null
          id?: number
          price?: number | null
          product_id?: number | null
          quantity?: number | null
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
            foreignKeyName: "appointment_products_staff_id_fkey"
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
          duration: number | null
          id: number
          price: number | null
          quantity: number | null
          service_id: string | null
          staff_user_id: string | null
        }
        Insert: {
          appointment_id?: number | null
          duration?: number | null
          id?: number
          price?: number | null
          quantity?: number | null
          service_id?: string | null
          staff_user_id?: string | null
        }
        Update: {
          appointment_id?: number | null
          duration?: number | null
          id?: number
          price?: number | null
          quantity?: number | null
          service_id?: string | null
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
            foreignKeyName: "appointment_services_staff_id_fkey"
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
          confirmation_token: string | null
          created_at: string | null
          customer_user_id: string | null
          discount_amount: number | null
          end_time: string
          id: number
          is_confirmed: boolean | null
          is_no_show: boolean | null
          new_id: string | null
          notes: string | null
          promo_code: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          total: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          cancel_reason?: string | null
          confirmation_token?: string | null
          created_at?: string | null
          customer_user_id?: string | null
          discount_amount?: number | null
          end_time: string
          id?: number
          is_confirmed?: boolean | null
          is_no_show?: boolean | null
          new_id?: string | null
          notes?: string | null
          promo_code?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          cancel_reason?: string | null
          confirmation_token?: string | null
          created_at?: string | null
          customer_user_id?: string | null
          discount_amount?: number | null
          end_time?: string
          id?: number
          is_confirmed?: boolean | null
          is_no_show?: boolean | null
          new_id?: string | null
          notes?: string | null
          promo_code?: string | null
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
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      histories: {
        Row: {
          action: Database["public"]["Enums"]["action_enum"] | null
          created_at: string | null
          history: Json
          id: number
          source_id: string
          table_name: string
          updated_at: string | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["action_enum"] | null
          created_at?: string | null
          history: Json
          id?: number
          source_id: string
          table_name: string
          updated_at?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["action_enum"] | null
          created_at?: string | null
          history?: Json
          id?: number
          source_id?: string
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          appointment_id: number | null
          appointment_json: Json | null
          appointment_status: string | null
          id: number
          invoice_number: string
          issued_at: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          appointment_id?: number | null
          appointment_json?: Json | null
          appointment_status?: string | null
          id?: number
          invoice_number: string
          issued_at?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          appointment_id?: number | null
          appointment_json?: Json | null
          appointment_status?: string | null
          id?: number
          invoice_number?: string
          issued_at?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appointment_id: number | null
          created_at: string | null
          id: number
          method: Database["public"]["Enums"]["payment_method"]
          source: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: number | null
          created_at?: string | null
          id?: number
          method: Database["public"]["Enums"]["payment_method"]
          source?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: number | null
          created_at?: string | null
          id?: number
          method?: Database["public"]["Enums"]["payment_method"]
          source?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: number
          product_id: number
        }
        Insert: {
          category_id: number
          product_id: number
        }
        Update: {
          category_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          discount_percent: number | null
          id: number
          is_active: boolean | null
          max_usage: number | null
          usage_count: number | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          discount_percent?: number | null
          id?: number
          is_active?: boolean | null
          max_usage?: number | null
          usage_count?: number | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          discount_percent?: number | null
          id?: number
          is_active?: boolean | null
          max_usage?: number | null
          usage_count?: number | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
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
      service_products: {
        Row: {
          product_id: number
          service_id: string
        }
        Insert: {
          product_id: number
          service_id: string
        }
        Update: {
          product_id?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
          id: string
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
          id?: string
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
          id?: string
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
          id: string
          key: string
          lang: string
          status: boolean | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          lang?: string
          status?: boolean | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          lang?: string
          status?: boolean | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      settings_backup: {
        Row: {
          created_at: string | null
          id: string | null
          key: string | null
          status: boolean | null
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          key?: string | null
          status?: boolean | null
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          key?: string | null
          status?: boolean | null
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string | null
          id: number
          position: string | null
          specializations: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          position?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          position?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_availability: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          staff_user_id: string | null
          start_time: string
          weekday: number
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          staff_user_id?: string | null
          start_time: string
          weekday: number
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          staff_user_id?: string | null
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "staff_availability_staff_user_id_fkey"
            columns: ["staff_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: number | null
          category: string | null
          created_at: string | null
          customer_name: string | null
          description: string | null
          id: string
          notes: string | null
          payment_type: string | null
          source: string | null
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          appointment_id?: number | null
          category?: string | null
          created_at?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          source?: string | null
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          appointment_id?: number | null
          category?: string | null
          created_at?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          source?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password: string
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          last_name: string | null
          note: string | null
          phone: string
          photo_url: string | null
          role: Database["public"]["Enums"]["role_enum"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password?: string
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          note?: string | null
          phone: string
          photo_url?: string | null
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          hashed_password?: string
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          note?: string | null
          phone?: string
          photo_url?: string | null
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
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_invoice_with_appointment: {
        Args: {
          p_invoice_number: string
          p_total_amount: number
          p_status: string
          p_appointment_json: Json
        }
        Returns: {
          id: number
          invoice_number: string
          total_amount: number
          status: string
          appointment_json: Json
          appointment_id: number
          issued_at: string
        }[]
      }
      get_available_staff_by_service_and_date: {
        Args:
          | { service_id: number; check_date: string }
          | { service_id: string; check_date: string }
        Returns: {
          user_id: string
          full_name: string
          email: string
          phone: string
          staff_position: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["role_enum"]
      }
      get_staff_by_service: {
        Args: { service_id: number } | { service_id: string }
        Returns: {
          user_id: string
          full_name: string
          email: string
          phone: string
          staff_position: string
        }[]
      }
      is_admin_or_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      action_enum: "INSERT" | "UPDATE" | "DELETE"
      appointment_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "rescheduled"
        | "in_progress"
        | "completed"
        | "no_show"
        | "awaiting_payment"
        | "paid"
        | "awaiting_confirmation"
      gender_enum: "male" | "female" | "other"
      payment_method:
        | "cash"
        | "card"
        | "bank"
        | "pos"
        | "discount"
        | "promo_code"
      payment_type: "income" | "expense"
      role_enum:
        | "cash"
        | "customer"
        | "super_admin"
        | "admin"
        | "staff"
        | "appointment"
        | "reception"
        | "service"
        | "product"
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
      action_enum: ["INSERT", "UPDATE", "DELETE"],
      appointment_status: [
        "pending",
        "confirmed",
        "cancelled",
        "rescheduled",
        "in_progress",
        "completed",
        "no_show",
        "awaiting_payment",
        "paid",
        "awaiting_confirmation",
      ],
      gender_enum: ["male", "female", "other"],
      payment_method: ["cash", "card", "bank", "pos", "discount", "promo_code"],
      payment_type: ["income", "expense"],
      role_enum: [
        "cash",
        "customer",
        "super_admin",
        "admin",
        "staff",
        "appointment",
        "reception",
        "service",
        "product",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          phone: string;
          email: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          phone: string;
          email?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          notes?: string | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          created_at: string;
          customer_id: string;
          service_id: string;
          staff_id: string;
          date: string;
          status: "pending" | "confirmed" | "paid" | "cancelled";
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          customer_id: string;
          service_id: string;
          staff_id: string;
          date: string;
          status?: "pending" | "confirmed" | "paid" | "cancelled";
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          customer_id?: string;
          service_id?: string;
          staff_id?: string;
          date?: string;
          status?: "pending" | "confirmed" | "paid" | "cancelled";
          notes?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string | null;
          duration: number;
          price: number;
          image_url: string | null;
          benefits: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description?: string | null;
          duration: number;
          price: number;
          image_url?: string | null;
          benefits?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string | null;
          duration?: number;
          price?: number;
          image_url?: string | null;
          benefits?: string[];
        };
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          service_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          service_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          service_id?: string | null;
        };
      };
      staff: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          phone: string;
          email: string | null;
          salary_type: "fixed" | "commission" | "both";
          salary_amount: number;
          commission_rate: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          phone: string;
          email?: string | null;
          salary_type: "fixed" | "commission" | "both";
          salary_amount: number;
          commission_rate?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          salary_type?: "fixed" | "commission" | "both";
          salary_amount?: number;
          commission_rate?: number | null;
        };
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          appointment_id: string;
          amount: number;
          status: "awaiting_payment" | "paid" | "cancelled";
          payment_date: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          appointment_id: string;
          amount: number;
          status?: "awaiting_payment" | "paid" | "cancelled";
          payment_date?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          appointment_id?: string;
          amount?: number;
          status?: "awaiting_payment" | "paid" | "cancelled";
          payment_date?: string | null;
        };
      };
      salary_transactions: {
        Row: {
          id: string;
          created_at: string;
          staff_id: string;
          amount: number;
          type: "salary" | "commission";
          date: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          staff_id: string;
          amount: number;
          type: "salary" | "commission";
          date: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          staff_id?: string;
          amount?: number;
          type?: "salary" | "commission";
          date?: string;
          notes?: string | null;
        };
      };
      work_logs: {
        Row: {
          id: string;
          created_at: string;
          staff_id: string;
          appointment_id: string;
          start_time: string;
          end_time: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          staff_id: string;
          appointment_id: string;
          start_time: string;
          end_time?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          staff_id?: string;
          appointment_id?: string;
          start_time?: string;
          end_time?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

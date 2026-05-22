export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          base_currency_code: string;
          theme_preference: "system" | "light" | "dark";
          slip_storage_preference: "delete_after_confirm" | "store_private";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          base_currency_code?: string;
          theme_preference?: "system" | "light" | "dark";
          slip_storage_preference?: "delete_after_confirm" | "store_private";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          icon: string | null;
          is_default: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          icon?: string | null;
          is_default?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount_minor: number;
          currency_code: string;
          base_amount_minor: number;
          base_currency_code: string;
          exchange_rate_to_base: number | null;
          occurred_at: string;
          merchant_name: string | null;
          receiver_name: string | null;
          bank_name: string | null;
          reference_id: string | null;
          note: string | null;
          payment_method: string | null;
          source: "manual" | "slip_ocr" | "future_api";
          raw_ocr_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount_minor: number;
          currency_code?: string;
          base_amount_minor: number;
          base_currency_code?: string;
          exchange_rate_to_base?: number | null;
          occurred_at: string;
          merchant_name?: string | null;
          receiver_name?: string | null;
          bank_name?: string | null;
          reference_id?: string | null;
          note?: string | null;
          payment_method?: string | null;
          source?: "manual" | "slip_ocr" | "future_api";
          raw_ocr_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          period: "daily" | "weekly" | "monthly";
          is_enabled: boolean;
          limit_minor: number;
          currency_code: string;
          rollover_mode: "none";
          warning_threshold: number;
          week_starts_on: "monday" | "sunday";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period: "daily" | "weekly" | "monthly";
          is_enabled?: boolean;
          limit_minor: number;
          currency_code?: string;
          rollover_mode?: "none";
          warning_threshold?: number;
          week_starts_on?: "monday" | "sunday";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["budgets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Budget = Database["public"]["Tables"]["budgets"]["Row"];

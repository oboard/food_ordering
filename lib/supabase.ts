import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          preferred_language: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          preferred_language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          preferred_language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name_en: string;
          name_zh: string;
          description_en: string | null;
          description_zh: string | null;
          image_url: string | null;
          sort_order: number | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_zh: string;
          description_en?: string | null;
          description_zh?: string | null;
          image_url?: string | null;
          sort_order?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_zh?: string;
          description_en?: string | null;
          description_zh?: string | null;
          image_url?: string | null;
          sort_order?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name_en: string;
          name_zh: string;
          description_en: string | null;
          description_zh: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean | null;
          is_featured: boolean | null;
          preparation_time: number | null;
          calories: number | null;
          ingredients_en: string[] | null;
          ingredients_zh: string[] | null;
          allergens: string[] | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name_en: string;
          name_zh: string;
          description_en?: string | null;
          description_zh?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean | null;
          is_featured?: boolean | null;
          preparation_time?: number | null;
          calories?: number | null;
          ingredients_en?: string[] | null;
          ingredients_zh?: string[] | null;
          allergens?: string[] | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name_en?: string;
          name_zh?: string;
          description_en?: string | null;
          description_zh?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean | null;
          is_featured?: boolean | null;
          preparation_time?: number | null;
          calories?: number | null;
          ingredients_en?: string[] | null;
          ingredients_zh?: string[] | null;
          allergens?: string[] | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          menu_item_id: string | null;
          quantity: number;
          special_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          menu_item_id?: string | null;
          quantity?: number;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          menu_item_id?: string | null;
          quantity?: number;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: string;
          total_amount: number;
          delivery_address: string | null;
          phone: string | null;
          special_instructions: string | null;
          estimated_delivery: string | null;
          payment_method: string | null;
          payment_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          status?: string;
          total_amount: number;
          delivery_address?: string | null;
          phone?: string | null;
          special_instructions?: string | null;
          estimated_delivery?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          status?: string;
          total_amount?: number;
          delivery_address?: string | null;
          phone?: string | null;
          special_instructions?: string | null;
          estimated_delivery?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          menu_item_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          menu_item_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          menu_item_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          special_instructions?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title_en: string;
          title_zh: string;
          message_en: string;
          message_zh: string;
          type: string;
          is_read: boolean | null;
          related_order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title_en: string;
          title_zh: string;
          message_en: string;
          message_zh: string;
          type?: string;
          is_read?: boolean | null;
          related_order_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title_en?: string;
          title_zh?: string;
          message_en?: string;
          message_zh?: string;
          type?: string;
          is_read?: boolean | null;
          related_order_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
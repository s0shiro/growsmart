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
      association: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      crop_categories: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      crop_varieties: {
        Row: {
          created_at: string
          crop_id: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          crop_id: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          crop_id?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_varieties_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "crop_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      harvest_records: {
        Row: {
          area_harvested: number
          created_at: string
          damaged_quantity: number | null
          damaged_reason: string | null
          farmer_id: string
          harvest_date: string
          harvest_images: string[] | null
          id: string
          planting_id: string
          profit: number
          user_id: string
          yield_quantity: number
        }
        Insert: {
          area_harvested: number
          created_at?: string
          damaged_quantity?: number | null
          damaged_reason?: string | null
          farmer_id: string
          harvest_date: string
          harvest_images?: string[] | null
          id?: string
          planting_id: string
          profit: number
          user_id: string
          yield_quantity: number
        }
        Update: {
          area_harvested?: number
          created_at?: string
          damaged_quantity?: number | null
          damaged_reason?: string | null
          farmer_id?: string
          harvest_date?: string
          harvest_images?: string[] | null
          id?: string
          planting_id?: string
          profit?: number
          user_id?: string
          yield_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "harvest_records_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "technician_farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvest_records_planting_id_fkey"
            columns: ["planting_id"]
            isOneToOne: false
            referencedRelation: "planting_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvest_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string
          damaged: number
          damaged_reason: string | null
          date: string
          farmer_id: string
          findings: string | null
          id: string
          planting_id: string
        }
        Insert: {
          created_at?: string
          damaged: number
          damaged_reason?: string | null
          date: string
          farmer_id: string
          findings?: string | null
          id?: string
          planting_id: string
        }
        Update: {
          created_at?: string
          damaged?: number
          damaged_reason?: string | null
          date?: string
          farmer_id?: string
          findings?: string | null
          id?: string
          planting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "technician_farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_planting_id_fkey"
            columns: ["planting_id"]
            isOneToOne: false
            referencedRelation: "planting_records"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          barangay: string
          created_at: string | null
          id: string
          municipality: string
          province: string
        }
        Insert: {
          barangay: string
          created_at?: string | null
          id?: string
          municipality: string
          province: string
        }
        Update: {
          barangay?: string
          created_at?: string | null
          id?: string
          municipality?: string
          province?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          planting_record_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          planting_record_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          planting_record_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_planting_record"
            columns: ["planting_record_id"]
            isOneToOne: false
            referencedRelation: "planting_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          status?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      planting_records: {
        Row: {
          area_planted: number
          category_specific: Json | null
          created_at: string
          crop_categoryId: string
          crop_type: string
          expenses: number
          farmer_id: string
          harvest_date: string
          id: string
          latitude: number
          location_id: string | null
          longitude: number
          planting_date: string
          quantity: number
          remarks: string
          status: string
          user_id: string
          variety: string
        }
        Insert: {
          area_planted: number
          category_specific?: Json | null
          created_at?: string
          crop_categoryId: string
          crop_type?: string
          expenses: number
          farmer_id: string
          harvest_date: string
          id?: string
          latitude: number
          location_id?: string | null
          longitude: number
          planting_date: string
          quantity: number
          remarks: string
          status: string
          user_id: string
          variety?: string
        }
        Update: {
          area_planted?: number
          category_specific?: Json | null
          created_at?: string
          crop_categoryId?: string
          crop_type?: string
          expenses?: number
          farmer_id?: string
          harvest_date?: string
          id?: string
          latitude?: number
          location_id?: string | null
          longitude?: number
          planting_date?: string
          quantity?: number
          remarks?: string
          status?: string
          user_id?: string
          variety?: string
        }
        Relationships: [
          {
            foreignKeyName: "planting_records_crop_categoryId_fkey"
            columns: ["crop_categoryId"]
            isOneToOne: false
            referencedRelation: "crop_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_crop_type_fkey"
            columns: ["crop_type"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "technician_farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_variety_fkey"
            columns: ["variety"]
            isOneToOne: false
            referencedRelation: "crop_varieties"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_farmers: {
        Row: {
          association_id: string | null
          avatar: string | null
          barangay: string
          created_at: string
          firstname: string
          gender: string
          id: string
          lastname: string
          municipality: string
          phone: string
          position: string | null
          rsbsa_number: number | null
          user_id: string
        }
        Insert: {
          association_id?: string | null
          avatar?: string | null
          barangay: string
          created_at?: string
          firstname: string
          gender: string
          id?: string
          lastname: string
          municipality: string
          phone: string
          position?: string | null
          rsbsa_number?: number | null
          user_id: string
        }
        Update: {
          association_id?: string | null
          avatar?: string | null
          barangay?: string
          created_at?: string
          firstname?: string
          gender?: string
          id?: string
          lastname?: string
          municipality?: string
          phone?: string
          position?: string | null
          rsbsa_number?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_farmers_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "association"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_farmers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      update_planting_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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

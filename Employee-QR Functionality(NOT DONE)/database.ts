export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          employee_id: string
          full_name: string
          position: string
          department: string
          photo_url: string | null
          employment_status: 'active' | 'inactive' | 'terminated'
          card_issue_date: string
          card_expiry_date: string | null
          last_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          full_name: string
          position: string
          department: string
          photo_url?: string | null
          employment_status?: 'active' | 'inactive' | 'terminated'
          card_issue_date?: string
          card_expiry_date?: string | null
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          full_name?: string
          position?: string
          department?: string
          photo_url?: string | null
          employment_status?: 'active' | 'inactive' | 'terminated'
          card_issue_date?: string
          card_expiry_date?: string | null
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Add other tables here as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_employee_verification: {
        Args: {
          emp_id: string
        }
        Returns: void
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

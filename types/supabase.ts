export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: string
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          submission_date: string
          is_read: boolean
          status: string
          notes: string | null
          attachments: string[] | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          submission_date?: string
          is_read?: boolean
          status?: string
          notes?: string | null
          attachments?: string[] | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          submission_date?: string
          is_read?: boolean
          status?: string
          notes?: string | null
          attachments?: string[] | null
        }
      }
      event_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          event_time: string | null
          location: string | null
          venue_name: string | null
          image_url: string | null
          category_id: string | null
          is_featured: boolean
          is_upcoming: boolean
          ticket_url: string | null
          created_at: string
          updated_at: string
          event_details: string | null
          event_highlights: Json | null
          performer_notes: string | null
          additional_images: string[] | null
          faq: Json | null
          event_type: string | null
          capacity: string | null
          age_restriction: string | null
          duration: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          event_time?: string | null
          location?: string | null
          venue_name?: string | null
          image_url?: string | null
          category_id?: string | null
          is_featured?: boolean
          is_upcoming?: boolean
          ticket_url?: string | null
          created_at?: string
          updated_at?: string
          event_details?: string | null
          event_highlights?: Json | null
          performer_notes?: string | null
          additional_images?: string[] | null
          faq?: Json | null
          event_type?: string | null
          capacity?: string | null
          age_restriction?: string | null
          duration?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          location?: string | null
          venue_name?: string | null
          image_url?: string | null
          category_id?: string | null
          is_featured?: boolean
          is_upcoming?: boolean
          ticket_url?: string | null
          created_at?: string
          updated_at?: string
          event_details?: string | null
          event_highlights?: Json | null
          performer_notes?: string | null
          additional_images?: string[] | null
          faq?: Json | null
          event_type?: string | null
          capacity?: string | null
          age_restriction?: string | null
          duration?: string | null
        }
      }
      instruments: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          title: string
          description: string | null
          media_type: string
          url: string
          thumbnail_url: string | null
          category_id: string | null
          is_featured: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          media_type: string
          url: string
          thumbnail_url?: string | null
          category_id?: string | null
          is_featured?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          media_type?: string
          url?: string
          thumbnail_url?: string | null
          category_id?: string | null
          is_featured?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      media_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      profile: {
        Row: {
          id: string
          full_name: string
          stage_name: string | null
          headline: string | null
          bio_short: string | null
          bio_full: string | null
          profile_image_url: string | null
          cover_image_url: string | null
          years_experience: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          stage_name?: string | null
          headline?: string | null
          bio_short?: string | null
          bio_full?: string | null
          profile_image_url?: string | null
          cover_image_url?: string | null
          years_experience?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          stage_name?: string | null
          headline?: string | null
          bio_short?: string | null
          bio_full?: string | null
          profile_image_url?: string | null
          cover_image_url?: string | null
          years_experience?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          section_name: string
          section_key: string
          title: string | null
          subtitle: string | null
          content: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_name: string
          section_key: string
          title?: string | null
          subtitle?: string | null
          content?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_name?: string
          section_key?: string
          title?: string | null
          subtitle?: string | null
          content?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      site_config: {
        Row: {
          id: string
          site_title: string
          site_description: string | null
          contact_email: string | null
          contact_phone: string | null
          whatsapp_number: string | null
          location: string | null
          social_instagram: string | null
          social_facebook: string | null
          social_youtube: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_title: string
          site_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_number?: string | null
          location?: string | null
          social_instagram?: string | null
          social_facebook?: string | null
          social_youtube?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_title?: string
          site_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_number?: string | null
          location?: string | null
          social_instagram?: string | null
          social_facebook?: string | null
          social_youtube?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      specialties: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_name: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_name?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_name?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      stats: {
        Row: {
          id: string
          stat_name: string
          stat_value: string
          icon_name: string | null
          description: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stat_name: string
          stat_value: string
          icon_name?: string | null
          description?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stat_name?: string
          stat_value?: string
          icon_name?: string | null
          description?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          subscribed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscribed_at?: string
          is_active?: boolean
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          position: string | null
          company: string | null
          content: string
          avatar_url: string | null
          rating: number | null
          is_approved: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position?: string | null
          company?: string | null
          content: string
          avatar_url?: string | null
          rating?: number | null
          is_approved?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string | null
          company?: string | null
          content?: string
          avatar_url?: string | null
          rating?: number | null
          is_approved?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
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

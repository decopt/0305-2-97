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
      agendamentos: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          custom_url: string | null
          data_agendada: string | null
          email_cliente: string | null
          funcionario_id: string | null
          horario_agendado: string | null
          id: string
          nome_cliente: string | null
          notes: string | null
          observacoes_cliente: string | null
          service_id: string | null
          servico: string | null
          servico_id: string | null
          situacao: string | null
          staff_id: string | null
          status: string
          telefone_cliente: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          custom_url?: string | null
          data_agendada?: string | null
          email_cliente?: string | null
          funcionario_id?: string | null
          horario_agendado?: string | null
          id?: string
          nome_cliente?: string | null
          notes?: string | null
          observacoes_cliente?: string | null
          service_id?: string | null
          servico?: string | null
          servico_id?: string | null
          situacao?: string | null
          staff_id?: string | null
          status?: string
          telefone_cliente?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          custom_url?: string | null
          data_agendada?: string | null
          email_cliente?: string | null
          funcionario_id?: string | null
          horario_agendado?: string | null
          id?: string
          nome_cliente?: string | null
          notes?: string | null
          observacoes_cliente?: string | null
          service_id?: string | null
          servico?: string | null
          servico_id?: string | null
          situacao?: string | null
          staff_id?: string | null
          status?: string
          telefone_cliente?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos_duplicate: {
        Row: {
          created_at: string | null
          data: string | null
          email: string | null
          empresa_id: string | null
          hora: string | null
          id: string
          nome: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          email?: string | null
          empresa_id?: string | null
          hora?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          email?: string | null
          empresa_id?: string | null
          hora?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_duplicate_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos1: {
        Row: {
          created_at: string | null
          data: string | null
          data_agendada: string | null
          email: string | null
          email_cliente: string | null
          empresa_id: string | null
          funcionario_id: string | null
          hora: string | null
          horario_agendado: string | null
          id: string
          nome: string | null
          nome_cliente: string | null
          observacoes_cliente: string | null
          servico_id: string | null
          situacao: string | null
          telefone: string | null
          telefone_cliente: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          data_agendada?: string | null
          email?: string | null
          email_cliente?: string | null
          empresa_id?: string | null
          funcionario_id?: string | null
          hora?: string | null
          horario_agendado?: string | null
          id?: string
          nome?: string | null
          nome_cliente?: string | null
          observacoes_cliente?: string | null
          servico_id?: string | null
          situacao?: string | null
          telefone?: string | null
          telefone_cliente?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          data_agendada?: string | null
          email?: string | null
          email_cliente?: string | null
          empresa_id?: string | null
          funcionario_id?: string | null
          hora?: string | null
          horario_agendado?: string | null
          id?: string
          nome?: string | null
          nome_cliente?: string | null
          observacoes_cliente?: string | null
          servico_id?: string | null
          situacao?: string | null
          telefone?: string | null
          telefone_cliente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          custom_url: string | null
          data_agendada: string | null
          email_cliente: string | null
          funcionario_id: string | null
          horario_agendado: string | null
          id: string
          nome_cliente: string | null
          notes: string | null
          observacoes_cliente: string | null
          scheduled_at: string
          scheduled_date: string | null
          scheduled_time: string | null
          service_id: string | null
          servico: string | null
          servico_id: string | null
          situacao: string | null
          staff_id: string | null
          status: string
          telefone_cliente: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          custom_url?: string | null
          data_agendada?: string | null
          email_cliente?: string | null
          funcionario_id?: string | null
          horario_agendado?: string | null
          id?: string
          nome_cliente?: string | null
          notes?: string | null
          observacoes_cliente?: string | null
          scheduled_at: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          servico?: string | null
          servico_id?: string | null
          situacao?: string | null
          staff_id?: string | null
          status?: string
          telefone_cliente?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          custom_url?: string | null
          data_agendada?: string | null
          email_cliente?: string | null
          funcionario_id?: string | null
          horario_agendado?: string | null
          id?: string
          nome_cliente?: string | null
          notes?: string | null
          observacoes_cliente?: string | null
          scheduled_at?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          servico?: string | null
          servico_id?: string | null
          situacao?: string | null
          staff_id?: string | null
          status?: string
          telefone_cliente?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_duplicate_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_duplicate_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      available_hours: {
        Row: {
          created_at: string
          dia_semana: number | null
          end_time: string
          fim_almoco: string | null
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          inicio_almoco: string | null
          lunch_break_end: string | null
          lunch_break_start: string | null
          start_time: string
          updated_at: string
          user_id: string
          weekday: string
        }
        Insert: {
          created_at?: string
          dia_semana?: number | null
          end_time: string
          fim_almoco?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          inicio_almoco?: string | null
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          start_time: string
          updated_at?: string
          user_id: string
          weekday: string
        }
        Update: {
          created_at?: string
          dia_semana?: number | null
          end_time?: string
          fim_almoco?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          inicio_almoco?: string | null
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
          weekday?: string
        }
        Relationships: []
      }
      available_hours_duplicate: {
        Row: {
          created_at: string
          end_time: string
          id: string
          lunch_break_end: string | null
          lunch_break_start: string | null
          start_time: string
          updated_at: string
          user_id: string
          weekday: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          start_time: string
          updated_at?: string
          user_id: string
          weekday: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
          weekday?: string
        }
        Relationships: []
      }
      company_config: {
        Row: {
          address: string | null
          banner_url: string | null
          color_theme: string | null
          company_name: string | null
          created_at: string
          custom_url: string | null
          description: string | null
          email: string | null
          fuso_horario: string | null
          id: string
          logo_url: string | null
          monthly_limit: number
          phone: string | null
          plan_type: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          usar_horario_fixo: boolean | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          color_theme?: string | null
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          description?: string | null
          email?: string | null
          fuso_horario?: string | null
          id?: string
          logo_url?: string | null
          monthly_limit?: number
          phone?: string | null
          plan_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          usar_horario_fixo?: boolean | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          color_theme?: string | null
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          description?: string | null
          email?: string | null
          fuso_horario?: string | null
          id?: string
          logo_url?: string | null
          monthly_limit?: number
          phone?: string | null
          plan_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          usar_horario_fixo?: boolean | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      company_config_duplicate: {
        Row: {
          address: string | null
          banner_url: string | null
          color_theme: string | null
          company_name: string | null
          created_at: string
          custom_url: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          monthly_limit: number
          phone: string | null
          plan_type: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          color_theme?: string | null
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          monthly_limit?: number
          phone?: string | null
          plan_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          color_theme?: string | null
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          monthly_limit?: number
          phone?: string | null
          plan_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      configuracao_horario: {
        Row: {
          created_at: string | null
          fuso_horario: string | null
          id: string
          updated_at: string | null
          usar_horario_fixo: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fuso_horario?: string | null
          id?: string
          updated_at?: string | null
          usar_horario_fixo?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fuso_horario?: string | null
          id?: string
          updated_at?: string | null
          usar_horario_fixo?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      horarios_disponiveis: {
        Row: {
          created_at: string | null
          dia_semana: number
          fim_almoco: string | null
          horario_fim: string
          horario_inicio: string
          id: string
          inicio_almoco: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dia_semana: number
          fim_almoco?: string | null
          horario_fim: string
          horario_inicio: string
          id?: string
          inicio_almoco?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dia_semana?: number
          fim_almoco?: string | null
          horario_fim?: string
          horario_inicio?: string
          id?: string
          inicio_almoco?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metodo_pagamento: string | null
          moeda: string | null
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
          valor: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
          valor?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
          valor?: number | null
        }
        Relationships: []
      }
      payments_duplicate: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          agendamentos_mes: number | null
          business_description: string | null
          company_name: string | null
          companyName: string | null
          created_at: string
          custom_url: string | null
          descricao_empresa: string | null
          description: string | null
          endereco: string | null
          evo: string | null
          id: string
          logo_url: string | null
          nome: string | null
          phone: string | null
          plan: string | null
          responsible_name: string | null
          responsibleName: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          agendamentos_mes?: number | null
          business_description?: string | null
          company_name?: string | null
          companyName?: string | null
          created_at?: string
          custom_url?: string | null
          descricao_empresa?: string | null
          description?: string | null
          endereco?: string | null
          evo?: string | null
          id: string
          logo_url?: string | null
          nome?: string | null
          phone?: string | null
          plan?: string | null
          responsible_name?: string | null
          responsibleName?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          agendamentos_mes?: number | null
          business_description?: string | null
          company_name?: string | null
          companyName?: string | null
          created_at?: string
          custom_url?: string | null
          descricao_empresa?: string | null
          description?: string | null
          endereco?: string | null
          evo?: string | null
          id?: string
          logo_url?: string | null
          nome?: string | null
          phone?: string | null
          plan?: string | null
          responsible_name?: string | null
          responsibleName?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles_duplicatebackup: {
        Row: {
          company_name: string | null
          created_at: string
          custom_url: string | null
          id: string
          responsible_name: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          id: string
          responsible_name?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          custom_url?: string | null
          id?: string
          responsible_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          ativo: boolean | null
          created_at: string
          descricao: string | null
          description: string | null
          duracao: number | null
          duration: number
          id: string
          name: string | null
          nome: string | null
          preco: number | null
          price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          description?: string | null
          duracao?: number | null
          duration: number
          id?: string
          name?: string | null
          nome?: string | null
          preco?: number | null
          price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          description?: string | null
          duracao?: number | null
          duration?: number
          id?: string
          name?: string | null
          nome?: string | null
          preco?: number | null
          price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          active: boolean | null
          ativo: boolean | null
          created_at: string
          descricao: string | null
          description: string | null
          duracao: number | null
          duration: number
          id: string
          name: string | null
          nome: string | null
          preco: number | null
          price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          description?: string | null
          duracao?: number | null
          duration: number
          id?: string
          name?: string | null
          nome?: string | null
          preco?: number | null
          price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          description?: string | null
          duracao?: number | null
          duration?: number
          id?: string
          name?: string | null
          nome?: string | null
          preco?: number | null
          price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean | null
          ativo: boolean | null
          avatar_url: string | null
          bio: string | null
          cargo: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          nome: string | null
          phone: string | null
          position: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          ativo?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          nome?: string | null
          phone?: string | null
          position?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          ativo?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          nome?: string | null
          phone?: string | null
          position?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff_duplicate: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          position: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff_services: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          staff_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          staff_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_services_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services_duplicate: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          staff_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          staff_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_services_duplicate_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_services_duplicate_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_public_bucket_policy: {
        Args: { bucket_name: string }
        Returns: undefined
      }
      get_clients_with_stats: {
        Args: { p_user_id: string }
        Returns: {
          client_name: string
          client_email: string
          client_phone: string
          appointment_count: number
          last_appointment: string
        }[]
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
    Enums: {},
  },
} as const

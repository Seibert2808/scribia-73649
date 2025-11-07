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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      fcm_pos_parto: {
        Row: {
          amamentacao: string | null
          cpf: string
          created_at: string
          data_email_enviado: string | null
          data_resumo_gerado: string | null
          dt_consulta: string
          dt_parto: string | null
          email_enviado: string | null
          emocional: string | null
          historico: string | null
          id: number
          nome: string
          observacao: string | null
          pos_mediato: string | null
          profissional: string
          resumo_ia_json: Json | null
          sinais_vitais: string | null
          social: string | null
          tipo_consulta: string | null
        }
        Insert: {
          amamentacao?: string | null
          cpf: string
          created_at?: string
          data_email_enviado?: string | null
          data_resumo_gerado?: string | null
          dt_consulta: string
          dt_parto?: string | null
          email_enviado?: string | null
          emocional?: string | null
          historico?: string | null
          id?: number
          nome: string
          observacao?: string | null
          pos_mediato?: string | null
          profissional: string
          resumo_ia_json?: Json | null
          sinais_vitais?: string | null
          social?: string | null
          tipo_consulta?: string | null
        }
        Update: {
          amamentacao?: string | null
          cpf?: string
          created_at?: string
          data_email_enviado?: string | null
          data_resumo_gerado?: string | null
          dt_consulta?: string
          dt_parto?: string | null
          email_enviado?: string | null
          emocional?: string | null
          historico?: string | null
          id?: number
          nome?: string
          observacao?: string | null
          pos_mediato?: string | null
          profissional?: string
          resumo_ia_json?: Json | null
          sinais_vitais?: string | null
          social?: string | null
          tipo_consulta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_parto_profissional_fkey"
            columns: ["profissional"]
            isOneToOne: false
            referencedRelation: "fcm_profissionais"
            referencedColumns: ["profissional"]
          },
        ]
      }
      fcm_profissionais: {
        Row: {
          created_at: string
          email: string
          funcao: string
          id: number
          profissional: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          funcao?: string
          id?: number
          profissional: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          funcao?: string
          id?: number
          profissional?: string
          whatsapp?: string
        }
        Relationships: []
      }
      fiscalizacao_pads: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_abertura: string
          data_despacho: string | null
          id: string
          nome: string
          nro_pad: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_abertura: string
          data_despacho?: string | null
          id?: string
          nome: string
          nro_pad: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_abertura?: string
          data_despacho?: string | null
          id?: string
          nome?: string
          nro_pad?: string
        }
        Relationships: []
      }
      insurance_payers: {
        Row: {
          id: string
          name_plan: string | null
          operator_plan: string | null
        }
        Insert: {
          id?: string
          name_plan?: string | null
          operator_plan?: string | null
        }
        Update: {
          id?: string
          name_plan?: string | null
          operator_plan?: string | null
        }
        Relationships: []
      }
      ns_clinics: {
        Row: {
          city_clinic: string | null
          complement_clinic: string | null
          created_at: string
          district_clinic: string | null
          id_clinics: string
          nome_clinica: string
          number_clinic: string | null
          org_type: Database["public"]["Enums"]["org_type"]
          state_clinic: string | null
          street_clinic: string | null
          updated_at: string
          zipcode_clinic: string | null
        }
        Insert: {
          city_clinic?: string | null
          complement_clinic?: string | null
          created_at?: string
          district_clinic?: string | null
          id_clinics?: string
          nome_clinica: string
          number_clinic?: string | null
          org_type?: Database["public"]["Enums"]["org_type"]
          state_clinic?: string | null
          street_clinic?: string | null
          updated_at?: string
          zipcode_clinic?: string | null
        }
        Update: {
          city_clinic?: string | null
          complement_clinic?: string | null
          created_at?: string
          district_clinic?: string | null
          id_clinics?: string
          nome_clinica?: string
          number_clinic?: string | null
          org_type?: Database["public"]["Enums"]["org_type"]
          state_clinic?: string | null
          street_clinic?: string | null
          updated_at?: string
          zipcode_clinic?: string | null
        }
        Relationships: []
      }
      ns_id_pacientes: {
        Row: {
          birth_date: string | null
          city_patient: string | null
          complement_patient: string | null
          cpf: string | null
          created_at: string
          district_patient: string | null
          education: string | null
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id_patient: string
          number_patient: string | null
          state_patient: string | null
          street_patient: string | null
          updated_at: string
          whatsapp_e164: string | null
          zipcode_patient: string | null
        }
        Insert: {
          birth_date?: string | null
          city_patient?: string | null
          complement_patient?: string | null
          cpf?: string | null
          created_at?: string
          district_patient?: string | null
          education?: string | null
          email?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id_patient?: string
          number_patient?: string | null
          state_patient?: string | null
          street_patient?: string | null
          updated_at?: string
          whatsapp_e164?: string | null
          zipcode_patient?: string | null
        }
        Update: {
          birth_date?: string | null
          city_patient?: string | null
          complement_patient?: string | null
          cpf?: string | null
          created_at?: string
          district_patient?: string | null
          education?: string | null
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id_patient?: string
          number_patient?: string | null
          state_patient?: string | null
          street_patient?: string | null
          updated_at?: string
          whatsapp_e164?: string | null
          zipcode_patient?: string | null
        }
        Relationships: []
      }
      ns_offices: {
        Row: {
          city_office: string | null
          complement_office: string | null
          created_at: string
          district_office: string | null
          id_offices: string
          nome_office: string
          number_office: string | null
          state_office: string | null
          street_office: string | null
          updated_at: string
          zipcode_office: string | null
        }
        Insert: {
          city_office?: string | null
          complement_office?: string | null
          created_at?: string
          district_office?: string | null
          id_offices?: string
          nome_office: string
          number_office?: string | null
          state_office?: string | null
          street_office?: string | null
          updated_at?: string
          zipcode_office?: string | null
        }
        Update: {
          city_office?: string | null
          complement_office?: string | null
          created_at?: string
          district_office?: string | null
          id_offices?: string
          nome_office?: string
          number_office?: string | null
          state_office?: string | null
          street_office?: string | null
          updated_at?: string
          zipcode_office?: string | null
        }
        Relationships: []
      }
      ns_patient_insurance_cards: {
        Row: {
          card_number: string | null
          created_at: string | null
          has_coparticipation: boolean | null
          id: string
          patient_id: string
          payer_id: string | null
        }
        Insert: {
          card_number?: string | null
          created_at?: string | null
          has_coparticipation?: boolean | null
          id?: string
          patient_id: string
          payer_id?: string | null
        }
        Update: {
          card_number?: string | null
          created_at?: string | null
          has_coparticipation?: boolean | null
          id?: string
          patient_id?: string
          payer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_cards_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "ns_id_pacientes"
            referencedColumns: ["id_patient"]
          },
          {
            foreignKeyName: "patient_insurance_cards_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "insurance_payers"
            referencedColumns: ["id"]
          },
        ]
      }
      ns_patients: {
        Row: {
          cpf: string
          created_at: string | null
          data_nascimento: string
          data_parto: string | null
          data_ultima_menstruacao: string | null
          diabetes_gestacional: boolean | null
          diabetes_preexistente: boolean | null
          email: string | null
          endereco: string
          fase_atual: string
          hipertensao: boolean | null
          id: string
          idade_gestacional: number | null
          is_caso_risco: boolean | null
          nome_completo: string
          numero_abortos: number
          numero_gestacoes: number
          numero_partos: number
          pre_eclampsia: boolean | null
          profissional_id: string
          status: string | null
          telefone: string
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          data_nascimento: string
          data_parto?: string | null
          data_ultima_menstruacao?: string | null
          diabetes_gestacional?: boolean | null
          diabetes_preexistente?: boolean | null
          email?: string | null
          endereco: string
          fase_atual: string
          hipertensao?: boolean | null
          id?: string
          idade_gestacional?: number | null
          is_caso_risco?: boolean | null
          nome_completo: string
          numero_abortos?: number
          numero_gestacoes?: number
          numero_partos?: number
          pre_eclampsia?: boolean | null
          profissional_id: string
          status?: string | null
          telefone: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          data_nascimento?: string
          data_parto?: string | null
          data_ultima_menstruacao?: string | null
          diabetes_gestacional?: boolean | null
          diabetes_preexistente?: boolean | null
          email?: string | null
          endereco?: string
          fase_atual?: string
          hipertensao?: boolean | null
          id?: string
          idade_gestacional?: number | null
          is_caso_risco?: boolean | null
          nome_completo?: string
          numero_abortos?: number
          numero_gestacoes?: number
          numero_partos?: number
          pre_eclampsia?: boolean | null
          profissional_id?: string
          status?: string | null
          telefone?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      ns_professional_affiliations: {
        Row: {
          created_at: string | null
          id: string
          professional_id: string
          specialty_id: string | null
          unit_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          professional_id: string
          specialty_id?: string | null
          unit_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          professional_id?: string
          specialty_id?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_affiliations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "ns_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      ns_professionals: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone_e164: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone_e164?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone_e164?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ns_speciality: {
        Row: {
          created_at: string
          id_speciality: number
          nome_professional: string | null
          speciality: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id_speciality?: number
          nome_professional?: string | null
          speciality?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id_speciality?: number
          nome_professional?: string | null
          speciality?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      oparto_autenticacao: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          nome_completo: string
          profissao: string | null
          senha: string | null
          updated_at: string | null
          user_type: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          nome_completo: string
          profissao?: string | null
          senha?: string | null
          updated_at?: string | null
          user_type?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          nome_completo?: string
          profissao?: string | null
          senha?: string | null
          updated_at?: string | null
          user_type?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      oparto_contato: {
        Row: {
          criado_em: string | null
          id: string
          mensagem: string
          profissional_id: string
          resposta: boolean | null
          resposta_em: string | null
          tipo: Database["public"]["Enums"]["tipo_contato"]
          titulo: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          mensagem: string
          profissional_id: string
          resposta?: boolean | null
          resposta_em?: string | null
          tipo: Database["public"]["Enums"]["tipo_contato"]
          titulo: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          mensagem?: string
          profissional_id?: string
          resposta?: boolean | null
          resposta_em?: string | null
          tipo?: Database["public"]["Enums"]["tipo_contato"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "contato_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_conteudo_avaliacoes: {
        Row: {
          conteudo_id: string
          criado_em: string | null
          gostou: boolean
          id: string
          profissional_id: string
        }
        Insert: {
          conteudo_id: string
          criado_em?: string | null
          gostou: boolean
          id?: string
          profissional_id: string
        }
        Update: {
          conteudo_id?: string
          criado_em?: string | null
          gostou?: boolean
          id?: string
          profissional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oparto_conteudo_avaliacoes_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "oparto_conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oparto_conteudo_avaliacoes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_conteudos: {
        Row: {
          criado_em: string | null
          id: string
          link: string
          profissional_id: string
          tipo: Database["public"]["Enums"]["tipo_conteudo"]
          titulo: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          link: string
          profissional_id: string
          tipo?: Database["public"]["Enums"]["tipo_conteudo"]
          titulo: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          link?: string
          profissional_id?: string
          tipo?: Database["public"]["Enums"]["tipo_conteudo"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "conteudos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_historico_envios: {
        Row: {
          conteudo_id: string
          enviado_em: string | null
          id: string
          paciente_id: string
        }
        Insert: {
          conteudo_id: string
          enviado_em?: string | null
          id?: string
          paciente_id: string
        }
        Update: {
          conteudo_id?: string
          enviado_em?: string | null
          id?: string
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_envios_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "oparto_conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_envios_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "oparto_pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_pacientes: {
        Row: {
          criado_em: string | null
          data_parto: string | null
          desfecho: string | null
          dpp: string | null
          dum: string | null
          email: string | null
          fatores_risco_fetais: string[] | null
          fatores_risco_obs: string[] | null
          id: string
          nome: string
          observacao: string | null
          profissional_id: string
          risco_fetais: boolean | null
          risco_obs: boolean | null
          ultrassom_data: string | null
          ultrassom_idade_gestacional: number | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          criado_em?: string | null
          data_parto?: string | null
          desfecho?: string | null
          dpp?: string | null
          dum?: string | null
          email?: string | null
          fatores_risco_fetais?: string[] | null
          fatores_risco_obs?: string[] | null
          id?: string
          nome: string
          observacao?: string | null
          profissional_id: string
          risco_fetais?: boolean | null
          risco_obs?: boolean | null
          ultrassom_data?: string | null
          ultrassom_idade_gestacional?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          criado_em?: string | null
          data_parto?: string | null
          desfecho?: string | null
          dpp?: string | null
          dum?: string | null
          email?: string | null
          fatores_risco_fetais?: string[] | null
          fatores_risco_obs?: string[] | null
          id?: string
          nome?: string
          observacao?: string | null
          profissional_id?: string
          risco_fetais?: boolean | null
          risco_obs?: boolean | null
          ultrassom_data?: string | null
          ultrassom_idade_gestacional?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_planejamento_conteudos: {
        Row: {
          conteudo_id: string
          data_envio: string
          enviado: boolean | null
          enviado_em: string | null
          id: string
          paciente_id: string
        }
        Insert: {
          conteudo_id: string
          data_envio: string
          enviado?: boolean | null
          enviado_em?: string | null
          id?: string
          paciente_id: string
        }
        Update: {
          conteudo_id?: string
          data_envio?: string
          enviado?: boolean | null
          enviado_em?: string | null
          id?: string
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planejamento_conteudos_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "oparto_conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planejamento_conteudos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "oparto_pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      oparto_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["oparto_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["oparto_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["oparto_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oparto_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "oparto_autenticacao"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_assinaturas: {
        Row: {
          criado_em: string
          id: string
          plano: string
          renovacao_em: string | null
          status: string
          stripe_customer_id: string | null
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          plano?: string
          renovacao_em?: string | null
          status?: string
          stripe_customer_id?: string | null
          usuario_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          plano?: string
          renovacao_em?: string | null
          status?: string
          stripe_customer_id?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribia_assinaturas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_client_free: {
        Row: {
          created_at: string
          email: string | null
          id_client_free: number
          name: string | null
          whatsapp_e164: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id_client_free?: number
          name?: string | null
          whatsapp_e164?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id_client_free?: number
          name?: string | null
          whatsapp_e164?: string | null
        }
        Relationships: []
      }
      scribia_configuracoes_organizador: {
        Row: {
          agencia: string | null
          atualizado_em: string | null
          bairro_endereco: string | null
          banco: string | null
          cep_comercial: string | null
          cidade_comercial: string | null
          cnpj: string | null
          compartilhar_dados_anonimos: boolean | null
          complemento_endereco: string | null
          conta: string | null
          cpf_pessoal: string | null
          cpf_titular: string | null
          criado_em: string | null
          data_nascimento: string | null
          email_comercial: string | null
          email_pessoal: string | null
          endereco_comercial: string | null
          estado_comercial: string | null
          id: string
          inscricao_estadual: string | null
          logo_url: string | null
          nome_completo: string | null
          nome_empresa: string | null
          notificacoes_email: boolean | null
          notificacoes_whatsapp: boolean | null
          numero_endereco: string | null
          pix: string | null
          razao_social: string | null
          relatorios_automaticos: boolean | null
          rg: string | null
          telefone_comercial: string | null
          telefone_pessoal: string | null
          tipo_conta: string | null
          titular: string | null
          usuario_id: string
          website: string | null
        }
        Insert: {
          agencia?: string | null
          atualizado_em?: string | null
          bairro_endereco?: string | null
          banco?: string | null
          cep_comercial?: string | null
          cidade_comercial?: string | null
          cnpj?: string | null
          compartilhar_dados_anonimos?: boolean | null
          complemento_endereco?: string | null
          conta?: string | null
          cpf_pessoal?: string | null
          cpf_titular?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email_comercial?: string | null
          email_pessoal?: string | null
          endereco_comercial?: string | null
          estado_comercial?: string | null
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          nome_completo?: string | null
          nome_empresa?: string | null
          notificacoes_email?: boolean | null
          notificacoes_whatsapp?: boolean | null
          numero_endereco?: string | null
          pix?: string | null
          razao_social?: string | null
          relatorios_automaticos?: boolean | null
          rg?: string | null
          telefone_comercial?: string | null
          telefone_pessoal?: string | null
          tipo_conta?: string | null
          titular?: string | null
          usuario_id: string
          website?: string | null
        }
        Update: {
          agencia?: string | null
          atualizado_em?: string | null
          bairro_endereco?: string | null
          banco?: string | null
          cep_comercial?: string | null
          cidade_comercial?: string | null
          cnpj?: string | null
          compartilhar_dados_anonimos?: boolean | null
          complemento_endereco?: string | null
          conta?: string | null
          cpf_pessoal?: string | null
          cpf_titular?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email_comercial?: string | null
          email_pessoal?: string | null
          endereco_comercial?: string | null
          estado_comercial?: string | null
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          nome_completo?: string | null
          nome_empresa?: string | null
          notificacoes_email?: boolean | null
          notificacoes_whatsapp?: boolean | null
          numero_endereco?: string | null
          pix?: string | null
          razao_social?: string | null
          relatorios_automaticos?: boolean | null
          rg?: string | null
          telefone_comercial?: string | null
          telefone_pessoal?: string | null
          tipo_conta?: string | null
          titular?: string | null
          usuario_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_usuario_id"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_contato_organizador: {
        Row: {
          cidade: string
          criado_em: string
          email: string
          estado: string
          id: string
          nome_evento: string
          telefone: string
          total_participantes: number
        }
        Insert: {
          cidade: string
          criado_em?: string
          email: string
          estado: string
          id?: string
          nome_evento: string
          telefone: string
          total_participantes: number
        }
        Update: {
          cidade?: string
          criado_em?: string
          email?: string
          estado?: string
          id?: string
          nome_evento?: string
          telefone?: string
          total_participantes?: number
        }
        Relationships: []
      }
      scribia_eventos: {
        Row: {
          atualizado_em: string
          cidade: string | null
          criado_em: string
          data_fim: string | null
          data_inicio: string | null
          estado: string | null
          id: string
          nome_evento: string
          observacoes: string | null
          pais: string | null
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          cidade?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          estado?: string | null
          id?: string
          nome_evento: string
          observacoes?: string | null
          pais?: string | null
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          cidade?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          estado?: string | null
          id?: string
          nome_evento?: string
          observacoes?: string | null
          pais?: string | null
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribia_eventos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_livebooks: {
        Row: {
          atualizado_em: string
          criado_em: string
          docx_url: string | null
          erro_log: string | null
          html_url: string | null
          id: string
          palestra_id: string
          pdf_url: string | null
          status: Database["public"]["Enums"]["status_livebook"] | null
          tempo_processamento: number | null
          tipo_resumo: Database["public"]["Enums"]["tipo_resumo"]
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          docx_url?: string | null
          erro_log?: string | null
          html_url?: string | null
          id?: string
          palestra_id: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["status_livebook"] | null
          tempo_processamento?: number | null
          tipo_resumo: Database["public"]["Enums"]["tipo_resumo"]
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          docx_url?: string | null
          erro_log?: string | null
          html_url?: string | null
          id?: string
          palestra_id?: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["status_livebook"] | null
          tempo_processamento?: number | null
          tipo_resumo?: Database["public"]["Enums"]["tipo_resumo"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribia_livebooks_palestra_id_fkey"
            columns: ["palestra_id"]
            isOneToOne: false
            referencedRelation: "scribia_palestras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scribia_livebooks_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_palestras: {
        Row: {
          atualizado_em: string
          audio_url: string | null
          audio_urls: string[] | null
          confidence: number | null
          criado_em: string
          evento_id: string | null
          formato_escolhido:
            | Database["public"]["Enums"]["formato_palestra"]
            | null
          id: string
          nivel_escolhido:
            | Database["public"]["Enums"]["nivel_conhecimento"]
            | null
          origem_classificacao:
            | Database["public"]["Enums"]["origem_classificacao"]
            | null
          palestrante: string | null
          slides_url: string | null
          status: Database["public"]["Enums"]["status_palestra"] | null
          tags_tema: string[] | null
          titulo: string
          transcricao: string | null
          transcricao_url: string | null
          usuario_id: string
          webhook_destino: string | null
        }
        Insert: {
          atualizado_em?: string
          audio_url?: string | null
          audio_urls?: string[] | null
          confidence?: number | null
          criado_em?: string
          evento_id?: string | null
          formato_escolhido?:
            | Database["public"]["Enums"]["formato_palestra"]
            | null
          id?: string
          nivel_escolhido?:
            | Database["public"]["Enums"]["nivel_conhecimento"]
            | null
          origem_classificacao?:
            | Database["public"]["Enums"]["origem_classificacao"]
            | null
          palestrante?: string | null
          slides_url?: string | null
          status?: Database["public"]["Enums"]["status_palestra"] | null
          tags_tema?: string[] | null
          titulo: string
          transcricao?: string | null
          transcricao_url?: string | null
          usuario_id: string
          webhook_destino?: string | null
        }
        Update: {
          atualizado_em?: string
          audio_url?: string | null
          audio_urls?: string[] | null
          confidence?: number | null
          criado_em?: string
          evento_id?: string | null
          formato_escolhido?:
            | Database["public"]["Enums"]["formato_palestra"]
            | null
          id?: string
          nivel_escolhido?:
            | Database["public"]["Enums"]["nivel_conhecimento"]
            | null
          origem_classificacao?:
            | Database["public"]["Enums"]["origem_classificacao"]
            | null
          palestrante?: string | null
          slides_url?: string | null
          status?: Database["public"]["Enums"]["status_palestra"] | null
          tags_tema?: string[] | null
          titulo?: string
          transcricao?: string | null
          transcricao_url?: string | null
          usuario_id?: string
          webhook_destino?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scribia_palestras_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "scribia_eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scribia_palestras_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_tutor_sessions: {
        Row: {
          criado_em: string
          id: string
          pergunta: string
          resposta: string
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          pergunta: string
          resposta: string
          usuario_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          pergunta?: string
          resposta?: string
          usuario_id?: string
        }
        Relationships: []
      }
      scribia_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribia_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "scribia_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scribia_usuarios: {
        Row: {
          cpf: string | null
          criado_em: string
          email: string
          email_verificado: boolean | null
          formato_preferido: string | null
          id: string
          nivel_preferido: string | null
          nome_completo: string
          perfil_definido: boolean | null
          perfil_definido_em: string | null
          reset_senha_expira: string | null
          senha_hash: string | null
          token_reset_senha: string | null
          token_verificacao: string | null
          ultimo_login: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cpf?: string | null
          criado_em?: string
          email: string
          email_verificado?: boolean | null
          formato_preferido?: string | null
          id: string
          nivel_preferido?: string | null
          nome_completo: string
          perfil_definido?: boolean | null
          perfil_definido_em?: string | null
          reset_senha_expira?: string | null
          senha_hash?: string | null
          token_reset_senha?: string | null
          token_verificacao?: string | null
          ultimo_login?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cpf?: string | null
          criado_em?: string
          email?: string
          email_verificado?: boolean | null
          formato_preferido?: string | null
          id?: string
          nivel_preferido?: string | null
          nome_completo?: string
          perfil_definido?: boolean | null
          perfil_definido_em?: string | null
          reset_senha_expira?: string | null
          senha_hash?: string | null
          token_reset_senha?: string | null
          token_verificacao?: string | null
          ultimo_login?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_dias_pos_parto: {
        Args: { p_data_parto: string }
        Returns: number
      }
      get_current_user_email: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      has_oparto_role: {
        Args: {
          _role: Database["public"]["Enums"]["oparto_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_oparto_admin: { Args: never; Returns: boolean }
      scribia_assign_admin_role: {
        Args: { p_user_email: string }
        Returns: Json
      }
      scribia_cancel_livebook: {
        Args: { p_livebook_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_create_evento:
        | {
            Args: {
              p_cidade: string
              p_data_fim: string
              p_data_inicio: string
              p_estado: string
              p_nome_evento: string
              p_observacoes: string
              p_pais: string
              p_usuario_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_data_fim?: string
              p_data_inicio?: string
              p_descricao?: string
              p_local?: string
              p_nome: string
              p_usuario_id: string
            }
            Returns: Json
          }
      scribia_create_livebook: {
        Args: {
          p_palestra_id: string
          p_status?: string
          p_tipo_resumo: string
          p_usuario_id: string
        }
        Returns: Json
      }
      scribia_create_palestra: {
        Args: {
          p_audio_urls?: string[]
          p_confidence?: number
          p_evento_id: string
          p_formato_escolhido?: string
          p_nivel_escolhido?: string
          p_origem_classificacao?: string
          p_palestrante?: string
          p_slides_url?: string
          p_status?: string
          p_tags_tema?: string[]
          p_titulo: string
          p_usuario_id: string
          p_webhook_destino?: string
        }
        Returns: Json
      }
      scribia_delete_evento: {
        Args: { p_evento_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_delete_livebook: {
        Args: { p_livebook_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_delete_palestra: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_eventos: { Args: { p_usuario_id: string }; Returns: Json }
      scribia_get_livebook_by_palestra: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: {
          atualizado_em: string
          criado_em: string
          docx_url: string
          erro_log: string
          html_url: string
          id: string
          palestrante: string
          pdf_url: string
          status: string
          tipo_resumo: string
          titulo: string
        }[]
      }
      scribia_get_livebooks: {
        Args: { p_evento_id?: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_livebooks_by_palestra: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_palestra: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_palestra_for_livebook: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_palestra_status: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: {
          audio_urls: string[]
          id: string
          status: string
          transcricao: string
        }[]
      }
      scribia_get_palestras: {
        Args: { p_evento_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_get_user: { Args: { p_user_id: string }; Returns: Json }
      scribia_is_admin: { Args: { p_user_id: string }; Returns: boolean }
      scribia_login: {
        Args: { p_email: string; p_senha: string }
        Returns: Json
      }
      scribia_poll_palestra_status: {
        Args: { p_palestra_id: string; p_usuario_id: string }
        Returns: Json
      }
      scribia_request_password_reset: {
        Args: { p_email: string }
        Returns: Json
      }
      scribia_reset_password: {
        Args: { p_nova_senha: string; p_token: string }
        Returns: Json
      }
      scribia_signup: {
        Args: {
          p_cpf?: string
          p_email: string
          p_nome_completo: string
          p_senha: string
          p_whatsapp?: string
        }
        Returns: Json
      }
      scribia_update_evento:
        | {
            Args: {
              p_cidade: string
              p_data_fim: string
              p_data_inicio: string
              p_estado: string
              p_evento_id: string
              p_nome_evento: string
              p_observacoes: string
              p_pais: string
              p_usuario_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_data_fim?: string
              p_data_inicio?: string
              p_descricao?: string
              p_evento_id: string
              p_local?: string
              p_nome?: string
              p_usuario_id: string
            }
            Returns: Json
          }
      scribia_update_livebook: {
        Args: {
          p_conteudo?: Json
          p_livebook_id: string
          p_status?: string
          p_usuario_id: string
        }
        Returns: Json
      }
      scribia_update_palestra: {
        Args: {
          p_audio_urls?: string[]
          p_confidence?: number
          p_formato_escolhido?: string
          p_nivel_escolhido?: string
          p_origem_classificacao?: string
          p_palestra_id: string
          p_palestrante?: string
          p_slides_url?: string
          p_status?: string
          p_tags_tema?: string[]
          p_titulo?: string
          p_transcricao_url?: string
          p_usuario_id: string
          p_webhook_destino?: string
        }
        Returns: Json
      }
      scribia_update_palestra_from_livebook: {
        Args: {
          p_evento_id?: string
          p_palestra_id: string
          p_palestrante?: string
          p_remove_evento?: boolean
          p_titulo?: string
          p_usuario_id: string
        }
        Returns: Json
      }
      scribia_update_profile: {
        Args: { p_formato: string; p_nivel: string; p_user_id: string }
        Returns: Json
      }
      scribia_verify_email: { Args: { p_token: string }; Returns: Json }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "admin" | "user"
      appointment_status:
        | "scheduled"
        | "rescheduled"
        | "cancelled"
        | "no_show"
        | "attended"
        | "in_progress"
        | "completed"
      appointment_type:
        | "first_visit"
        | "return"
        | "exam"
        | "procedure"
        | "telemedicine"
      attendance_status:
        | "unknown"
        | "attended"
        | "no_show"
        | "late"
        | "left_early"
      channel:
        | "whatsapp"
        | "sms"
        | "phone"
        | "email"
        | "web"
        | "in_person"
        | "other"
      confirmation_status:
        | "pending"
        | "confirmed"
        | "declined"
        | "rebook_requested"
        | "cancel_requested"
      formato_palestra: "completo" | "compacto"
      gender: "female" | "male" | "other" | "prefer_not_say"
      location_kind: "clinic" | "office"
      nivel_conhecimento: "junior" | "pleno" | "senior"
      oparto_role: "admin" | "profissional" | "cliente"
      org_type: "clinic" | "professional"
      origem_classificacao: "auto" | "manual"
      payment_status:
        | "pending"
        | "authorized"
        | "paid"
        | "refunded"
        | "failed"
        | "cancelled"
      status_livebook:
        | "aguardando"
        | "transcrevendo"
        | "processando"
        | "concluido"
        | "erro"
      status_palestra: "aguardando" | "processando" | "concluido" | "erro"
      tipo_contato: "suporte" | "sugestao"
      tipo_conteudo: "publico" | "privado"
      tipo_desfecho: "aborto" | "parto_vaginal" | "cesariana"
      tipo_resumo:
        | "junior_completo"
        | "junior_compacto"
        | "pleno_completo"
        | "pleno_compacto"
        | "senior_completo"
        | "senior_compacto"
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
    Enums: {
      app_role: ["admin", "user"],
      appointment_status: [
        "scheduled",
        "rescheduled",
        "cancelled",
        "no_show",
        "attended",
        "in_progress",
        "completed",
      ],
      appointment_type: [
        "first_visit",
        "return",
        "exam",
        "procedure",
        "telemedicine",
      ],
      attendance_status: [
        "unknown",
        "attended",
        "no_show",
        "late",
        "left_early",
      ],
      channel: [
        "whatsapp",
        "sms",
        "phone",
        "email",
        "web",
        "in_person",
        "other",
      ],
      confirmation_status: [
        "pending",
        "confirmed",
        "declined",
        "rebook_requested",
        "cancel_requested",
      ],
      formato_palestra: ["completo", "compacto"],
      gender: ["female", "male", "other", "prefer_not_say"],
      location_kind: ["clinic", "office"],
      nivel_conhecimento: ["junior", "pleno", "senior"],
      oparto_role: ["admin", "profissional", "cliente"],
      org_type: ["clinic", "professional"],
      origem_classificacao: ["auto", "manual"],
      payment_status: [
        "pending",
        "authorized",
        "paid",
        "refunded",
        "failed",
        "cancelled",
      ],
      status_livebook: [
        "aguardando",
        "transcrevendo",
        "processando",
        "concluido",
        "erro",
      ],
      status_palestra: ["aguardando", "processando", "concluido", "erro"],
      tipo_contato: ["suporte", "sugestao"],
      tipo_conteudo: ["publico", "privado"],
      tipo_desfecho: ["aborto", "parto_vaginal", "cesariana"],
      tipo_resumo: [
        "junior_completo",
        "junior_compacto",
        "pleno_completo",
        "pleno_compacto",
        "senior_completo",
        "senior_compacto",
      ],
    },
  },
} as const

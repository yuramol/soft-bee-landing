export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      dw_heatleys_customers: {
        Row: {
          abn: string | null;
          account_price_level: string | null;
          branch: string | null;
          branch_code: string | null;
          classification: string | null;
          credit_limit: number | null;
          crm_id: string | null;
          customer_code: string;
          customer_name: string | null;
          customer_rep_name: string | null;
          date_created: string | null;
          delivery_address_line_1: string | null;
          delivery_address_line_2: string | null;
          delivery_address_line_3: string | null;
          delivery_code: string | null;
          delivery_postcode: string | null;
          delivery_state: string | null;
          entity: string | null;
          freight_code: string | null;
          geography: string | null;
          grading: string | null;
          industry_code: string | null;
          industry_name: string | null;
          internal_sales_code: string | null;
          internal_sales_rep_name: string | null;
          market_segment_code: string | null;
          market_segment_name: string | null;
          on_hold: boolean | null;
          parent_account: string | null;
          parent_name: string | null;
          post_pc: string | null;
          post1: string | null;
          post2: string | null;
          post3: string | null;
          post4: string | null;
          rep_email: string | null;
          rep_id: string | null;
          strategic_lead_code: string | null;
          strategic_lead_email: string | null;
          strategic_lead_name: string | null;
          trading_terms_code: string | null;
          trading_terms_name: string | null;
        };
        Insert: {
          abn?: string | null;
          account_price_level?: string | null;
          branch?: string | null;
          branch_code?: string | null;
          classification?: string | null;
          credit_limit?: number | null;
          crm_id?: string | null;
          customer_code: string;
          customer_name?: string | null;
          customer_rep_name?: string | null;
          date_created?: string | null;
          delivery_address_line_1?: string | null;
          delivery_address_line_2?: string | null;
          delivery_address_line_3?: string | null;
          delivery_code?: string | null;
          delivery_postcode?: string | null;
          delivery_state?: string | null;
          entity?: string | null;
          freight_code?: string | null;
          geography?: string | null;
          grading?: string | null;
          industry_code?: string | null;
          industry_name?: string | null;
          internal_sales_code?: string | null;
          internal_sales_rep_name?: string | null;
          market_segment_code?: string | null;
          market_segment_name?: string | null;
          on_hold?: boolean | null;
          parent_account?: string | null;
          parent_name?: string | null;
          post_pc?: string | null;
          post1?: string | null;
          post2?: string | null;
          post3?: string | null;
          post4?: string | null;
          rep_email?: string | null;
          rep_id?: string | null;
          strategic_lead_code?: string | null;
          strategic_lead_email?: string | null;
          strategic_lead_name?: string | null;
          trading_terms_code?: string | null;
          trading_terms_name?: string | null;
        };
        Update: {
          abn?: string | null;
          account_price_level?: string | null;
          branch?: string | null;
          branch_code?: string | null;
          classification?: string | null;
          credit_limit?: number | null;
          crm_id?: string | null;
          customer_code?: string;
          customer_name?: string | null;
          customer_rep_name?: string | null;
          date_created?: string | null;
          delivery_address_line_1?: string | null;
          delivery_address_line_2?: string | null;
          delivery_address_line_3?: string | null;
          delivery_code?: string | null;
          delivery_postcode?: string | null;
          delivery_state?: string | null;
          entity?: string | null;
          freight_code?: string | null;
          geography?: string | null;
          grading?: string | null;
          industry_code?: string | null;
          industry_name?: string | null;
          internal_sales_code?: string | null;
          internal_sales_rep_name?: string | null;
          market_segment_code?: string | null;
          market_segment_name?: string | null;
          on_hold?: boolean | null;
          parent_account?: string | null;
          parent_name?: string | null;
          post_pc?: string | null;
          post1?: string | null;
          post2?: string | null;
          post3?: string | null;
          post4?: string | null;
          rep_email?: string | null;
          rep_id?: string | null;
          strategic_lead_code?: string | null;
          strategic_lead_email?: string | null;
          strategic_lead_name?: string | null;
          trading_terms_code?: string | null;
          trading_terms_name?: string | null;
        };
        Relationships: [];
      };
      dw_heatleys_inventory: {
        Row: {
          allocated_stock: number | null;
          available_stock: number | null;
          date_added: string | null;
          inventory_unit_cost: number | null;
          lead_time: number | null;
          location_code: string;
          minimum_order_qty: number | null;
          on_order_qty: number | null;
          order_multiple: number | null;
          product_code: string;
          purchase_currency_code: string | null;
          purchase_factor: number | null;
          purchase_unit_cost: number | null;
          purchase_unit_of_measure: string | null;
          stock_on_hand: number | null;
          stocking_indicator: string | null;
          supply_code: string | null;
          supply_type: string | null;
          vendor_code: string | null;
        };
        Insert: {
          allocated_stock?: number | null;
          available_stock?: number | null;
          date_added?: string | null;
          inventory_unit_cost?: number | null;
          lead_time?: number | null;
          location_code: string;
          minimum_order_qty?: number | null;
          on_order_qty?: number | null;
          order_multiple?: number | null;
          product_code: string;
          purchase_currency_code?: string | null;
          purchase_factor?: number | null;
          purchase_unit_cost?: number | null;
          purchase_unit_of_measure?: string | null;
          stock_on_hand?: number | null;
          stocking_indicator?: string | null;
          supply_code?: string | null;
          supply_type?: string | null;
          vendor_code?: string | null;
        };
        Update: {
          allocated_stock?: number | null;
          available_stock?: number | null;
          date_added?: string | null;
          inventory_unit_cost?: number | null;
          lead_time?: number | null;
          location_code?: string;
          minimum_order_qty?: number | null;
          on_order_qty?: number | null;
          order_multiple?: number | null;
          product_code?: string;
          purchase_currency_code?: string | null;
          purchase_factor?: number | null;
          purchase_unit_cost?: number | null;
          purchase_unit_of_measure?: string | null;
          stock_on_hand?: number | null;
          stocking_indicator?: string | null;
          supply_code?: string | null;
          supply_type?: string | null;
          vendor_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_inventory_location';
            columns: ['location_code'];
            isOneToOne: false;
            referencedRelation: 'dw_heatleys_locations';
            referencedColumns: ['location_code'];
          },
          {
            foreignKeyName: 'fk_inventory_product';
            columns: ['product_code'];
            isOneToOne: false;
            referencedRelation: 'dw_heatleys_products';
            referencedColumns: ['product_code'];
          }
        ];
      };
      dw_heatleys_locations: {
        Row: {
          branch_code: string | null;
          location_code: string;
          location_name: string | null;
        };
        Insert: {
          branch_code?: string | null;
          location_code: string;
          location_name?: string | null;
        };
        Update: {
          branch_code?: string | null;
          location_code?: string;
          location_name?: string | null;
        };
        Relationships: [];
      };
      dw_heatleys_products: {
        Row: {
          bar_transactions_flag: string | null;
          core_stk: boolean | null;
          last_change_date: string | null;
          minimum_buy_quantity: number | null;
          p1: number | null;
          p2: number | null;
          p3: number | null;
          p4: number | null;
          p5: number | null;
          pack_quantity: number | null;
          product_category_code: string | null;
          product_category_name: string | null;
          product_code: string;
          product_group_code: string | null;
          product_group_name: string | null;
          product_name: string | null;
          selling_unit: string | null;
          stock_unit: string | null;
          supp_cost: number | null;
          supplier_identifier: string | null;
          supplier_last_adjust_date: string | null;
          supplier_name: string | null;
          supplier_rank_one: string | null;
          supplier_rank_one_last_adjust_date: string | null;
          tax_code: string | null;
        };
        Insert: {
          bar_transactions_flag?: string | null;
          core_stk?: boolean | null;
          last_change_date?: string | null;
          minimum_buy_quantity?: number | null;
          p1?: number | null;
          p2?: number | null;
          p3?: number | null;
          p4?: number | null;
          p5?: number | null;
          pack_quantity?: number | null;
          product_category_code?: string | null;
          product_category_name?: string | null;
          product_code: string;
          product_group_code?: string | null;
          product_group_name?: string | null;
          product_name?: string | null;
          selling_unit?: string | null;
          stock_unit?: string | null;
          supp_cost?: number | null;
          supplier_identifier?: string | null;
          supplier_last_adjust_date?: string | null;
          supplier_name?: string | null;
          supplier_rank_one?: string | null;
          supplier_rank_one_last_adjust_date?: string | null;
          tax_code?: string | null;
        };
        Update: {
          bar_transactions_flag?: string | null;
          core_stk?: boolean | null;
          last_change_date?: string | null;
          minimum_buy_quantity?: number | null;
          p1?: number | null;
          p2?: number | null;
          p3?: number | null;
          p4?: number | null;
          p5?: number | null;
          pack_quantity?: number | null;
          product_category_code?: string | null;
          product_category_name?: string | null;
          product_code?: string;
          product_group_code?: string | null;
          product_group_name?: string | null;
          product_name?: string | null;
          selling_unit?: string | null;
          stock_unit?: string | null;
          supp_cost?: number | null;
          supplier_identifier?: string | null;
          supplier_last_adjust_date?: string | null;
          supplier_name?: string | null;
          supplier_rank_one?: string | null;
          supplier_rank_one_last_adjust_date?: string | null;
          tax_code?: string | null;
        };
        Relationships: [];
      };
      quote_items: {
        Row: {
          cost: number;
          id: number;
          notes: string;
          original_id: string | null;
          qty: number;
          quote_id: number;
          sell_price: number;
          tax_amount: number | null;
          total_cost: number;
          total_sell: number;
        };
        Insert: {
          cost?: number;
          id?: never;
          notes?: string;
          original_id?: string | null;
          qty?: number;
          quote_id: number;
          sell_price?: number;
          tax_amount?: number | null;
          total_cost?: number;
          total_sell?: number;
        };
        Update: {
          cost?: number;
          id?: never;
          notes?: string;
          original_id?: string | null;
          qty?: number;
          quote_id?: number;
          sell_price?: number;
          tax_amount?: number | null;
          total_cost?: number;
          total_sell?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'quote_items_quote_id_fkey';
            columns: ['quote_id'];
            isOneToOne: false;
            referencedRelation: 'quotes';
            referencedColumns: ['id'];
          }
        ];
      };
      quotes: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: number;
          name: string;
          original_id: string | null;
          status: Database['public']['Enums']['quote_status'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: never;
          name: string;
          original_id?: string | null;
          status?: Database['public']['Enums']['quote_status'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: never;
          name?: string;
          original_id?: string | null;
          status?: Database['public']['Enums']['quote_status'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotes_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      tenders: {
        Row: {
          bdm: string;
          branch: string;
          created_at: string;
          created_by: string | null;
          customer_code: string;
          customer_name: string;
          decision_date: string | null;
          description: string;
          due_date: string | null;
          estimated_value: number;
          gp_percent: number;
          id: string;
          lines_count: number;
          location_code: string | null;
          lost_reason: string | null;
          original_id: string | null;
          received_date: string | null;
          status: Database['public']['Enums']['tender_status'];
          submitted_by: string | null;
          submitted_date: string | null;
          type: string;
          updated_at: string;
          win_loss_status: string;
        };
        Insert: {
          bdm?: string;
          branch?: string;
          created_at?: string;
          created_by?: string | null;
          customer_code?: string;
          customer_name: string;
          decision_date?: string | null;
          description?: string;
          due_date?: string | null;
          estimated_value?: number;
          gp_percent?: number;
          id?: string;
          lines_count?: number;
          location_code?: string | null;
          lost_reason?: string | null;
          original_id?: string | null;
          received_date?: string | null;
          status?: Database['public']['Enums']['tender_status'];
          submitted_by?: string | null;
          submitted_date?: string | null;
          type?: string;
          updated_at?: string;
          win_loss_status?: string;
        };
        Update: {
          bdm?: string;
          branch?: string;
          created_at?: string;
          created_by?: string | null;
          customer_code?: string;
          customer_name?: string;
          decision_date?: string | null;
          description?: string;
          due_date?: string | null;
          estimated_value?: number;
          gp_percent?: number;
          id?: string;
          lines_count?: number;
          location_code?: string | null;
          lost_reason?: string | null;
          original_id?: string | null;
          received_date?: string | null;
          status?: Database['public']['Enums']['tender_status'];
          submitted_by?: string | null;
          submitted_date?: string | null;
          type?: string;
          updated_at?: string;
          win_loss_status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tenders_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          logo_url: string | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      quote_status: 'draft' | 'submitted' | 'won' | 'lost_expired';
      tender_status: 'Draft' | 'Pricing' | 'Review' | 'Approval' | 'On Hold' | 'Completed' | 'Cancelled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {
      quote_status: ['draft', 'submitted', 'won', 'lost_expired'],
      tender_status: ['Draft', 'Pricing', 'Review', 'Approval', 'On Hold', 'Completed', 'Cancelled']
    }
  }
} as const;

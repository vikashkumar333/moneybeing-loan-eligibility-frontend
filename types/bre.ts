export interface BRERule {
  id: number;
  rule_name: string;
  field_name: string;
  operator: string;
  rule_value: string;
  failure_message: string;
  is_active: boolean;
  priority: number;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBRERuleRequest {
  rule_name: string;
  field_name: string;
  operator: string;
  rule_value: string;
  failure_message: string;
  is_active?: boolean;
  priority: number;
}

export interface UpdateBRERuleRequest {
  rule_name?: string;
  field_name?: string;
  operator?: string;
  rule_value?: string;
  failure_message?: string;
  is_active?: boolean;
  priority?: number;
}

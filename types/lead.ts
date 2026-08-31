export interface CreateLeadRequest {
  full_name: string;
  mobile: string;
  email?: string;
  date_of_birth: string; // YYYY-MM-DD
  city: string;
  pincode: string;
  loan_type: string;
  employment_type: string;
  monthly_income: number;
  loan_amount: number;
  property_value: number;
  consent: boolean;
}

export interface LeadResponse {
  status: string;
  lead_id: number;
  credit_score?: number | null;
  bre_status: string; // "Eligible" | "Not Eligible"
  reasons?: string[] | null;
}

export interface LeadListItem {
  id: number;
  full_name: string;
  mobile: string;
  email?: string | null;
  loan_type: string;
  employment_type: string;
  monthly_income: number;
  loan_amount: number;
  property_value: number;
  credit_score?: number | null;
  bre_status: string;
  created_at: string;
  rejection_reasons?: string[] | null;
}

export type LeadItem = LeadListItem;

export interface LeadBREResult {
  id: number;
  rule_id?: number | null;
  is_passed: boolean;
  failure_message?: string | null;
  evaluated_at: string;
}

export interface LeadDetail {
  id: number;
  full_name: string;
  mobile: string;
  email?: string | null;
  date_of_birth: string;
  city: string;
  pincode: string;
  loan_type: string;
  employment_type: string;
  monthly_income: number;
  loan_amount: number;
  property_value: number;
  credit_score?: number | null;
  bre_status: string;
  rejection_reasons?: string[] | null;
  created_at: string;
  updated_at: string;
  bre_results: LeadBREResult[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginatedLeadsResponse {
  status: string;
  data: LeadListItem[];
  pagination: PaginationMeta;
  message?: string;
}

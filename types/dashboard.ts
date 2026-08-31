export interface DashboardStats {
  total_leads: number;
  eligible_leads: number;
  rejected_leads: number;
  average_credit_score: number | null;
}

export interface LeadDistribution {
  eligible_count: number;
  not_eligible_count: number;
  by_loan_type: Record<string, number>;
  by_employment_type: Record<string, number>;
}

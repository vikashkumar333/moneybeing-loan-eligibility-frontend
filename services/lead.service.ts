import { fetchApi } from "./api";
import { CreateLeadRequest, LeadResponse, PaginatedLeadsResponse, LeadDetail } from "@/types/lead";

export interface LeadFilterParams {
  page?: number;
  page_size?: number;
  search?: string;
  loan_type?: string;
  employment_type?: string;
  bre_status?: string;
  city?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const leadService = {
  async createLead(payload: CreateLeadRequest): Promise<LeadResponse> {
    return await fetchApi<LeadResponse>("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async listLeads(params: LeadFilterParams = {}): Promise<PaginatedLeadsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.page_size) query.append("page_size", params.page_size.toString());
    if (params.search) query.append("search", params.search);
    if (params.loan_type) query.append("loan_type", params.loan_type);
    if (params.employment_type) query.append("employment_type", params.employment_type);
    if (params.bre_status) query.append("bre_status", params.bre_status);
    if (params.city) query.append("city", params.city);
    if (params.date_from) query.append("date_from", params.date_from);
    if (params.date_to) query.append("date_to", params.date_to);
    if (params.sort_by) query.append("sort_by", params.sort_by);
    if (params.sort_order) query.append("sort_order", params.sort_order);

    const qs = query.toString();
    return await fetchApi<PaginatedLeadsResponse>(`/leads${qs ? `?${qs}` : ""}`);
  },

  async getLeadDetail(leadId: number): Promise<LeadDetail> {
    const res = await fetchApi<{ status: string; data: LeadDetail }>(`/leads/${leadId}`);
    return res.data;
  },
};

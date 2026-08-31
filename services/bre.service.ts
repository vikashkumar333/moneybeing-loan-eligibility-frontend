import { fetchApi } from "./api";
import { BRERule, CreateBRERuleRequest, UpdateBRERuleRequest } from "@/types/bre";

export const breService = {
  async listRules(isActive?: boolean, fieldName?: string): Promise<BRERule[]> {
    const query = new URLSearchParams();
    if (isActive !== undefined) query.append("is_active", isActive.toString());
    if (fieldName) query.append("field_name", fieldName);
    const qs = query.toString();
    const res = await fetchApi<{ status: string; data: BRERule[] }>(`/bre-rules${qs ? `?${qs}` : ""}`);
    return res.data;
  },

  async createRule(payload: CreateBRERuleRequest): Promise<BRERule> {
    const res = await fetchApi<{ status: string; data: BRERule }>("/bre-rules", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateRule(ruleId: number, payload: UpdateBRERuleRequest): Promise<BRERule> {
    const res = await fetchApi<{ status: string; data: BRERule }>(`/bre-rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteRule(ruleId: number): Promise<void> {
    await fetchApi(`/bre-rules/${ruleId}`, {
      method: "DELETE",
    });
  },

  async toggleStatus(ruleId: number, isActive: boolean): Promise<BRERule> {
    const res = await fetchApi<{ status: string; data: BRERule }>(`/bre-rules/${ruleId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
    return res.data;
  },
};

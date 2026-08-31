import { fetchApi } from "./api";
import { DashboardStats, LeadDistribution } from "@/types/dashboard";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await fetchApi<{ status: string; data: DashboardStats }>("/dashboard/stats");
    return res.data;
  },

  async getDistribution(): Promise<LeadDistribution> {
    const res = await fetchApi<{ status: string; data: LeadDistribution }>("/dashboard/lead-distribution");
    return res.data;
  },
};

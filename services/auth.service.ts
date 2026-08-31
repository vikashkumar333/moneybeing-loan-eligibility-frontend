import { fetchApi } from "./api";
import { LoginRequest, LoginResponse, CurrentUserResponse, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetchApi<CurrentUserResponse>("/auth/me");
    if (res.data) {
      this.setUser(res.data);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors on client logout
    } finally {
      this.removeToken();
      this.removeUser();
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("moneybeing_auth_token");
  },

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("moneybeing_auth_token", token);
    }
  },

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("moneybeing_auth_token");
    }
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("moneybeing_user");
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("moneybeing_user", JSON.stringify(user));
    }
  },

  removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("moneybeing_user");
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

import { api, setAccessToken } from "@/lib/api";
import type { User, Role } from "@/types";
import type {
  LoginInput,
  RegisterPatientInput,
  RegisterDriverInput,
} from "@/lib/schemas/auth.schema";

interface AuthResponseData {
  user: User;
  accessToken: string;
}

// Cookie Helper for Next.js proxy.ts and Server Components
export const setAuthCookies = (token: string | null, role: Role | null) => {
  if (typeof document === "undefined") return;

  if (token && role) {
    // 7-day expiration
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `pulse_auth_token=${encodeURIComponent(
      token
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `pulse_user_role=${encodeURIComponent(
      role
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie =
      "pulse_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie =
      "pulse_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
};

export const authApi = {
  login: async (credentials: LoginInput): Promise<AuthResponseData> => {
    const data = await api.post<AuthResponseData>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    if (data?.accessToken && data?.user) {
      setAccessToken(data.accessToken);
      setAuthCookies(data.accessToken, data.user.role);
    }

    return data;
  },

  registerPatient: async (
    payload: RegisterPatientInput
  ): Promise<AuthResponseData> => {
    const data = await api.post<AuthResponseData>("/auth/register", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "PATIENT",
    });

    if (data?.accessToken && data?.user) {
      setAccessToken(data.accessToken);
      setAuthCookies(data.accessToken, data.user.role);
    }

    return data;
  },

  registerDriver: async (
    payload: RegisterDriverInput
  ): Promise<AuthResponseData> => {
    const data = await api.post<AuthResponseData>("/auth/register", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "DRIVER",
      licenseNumber: payload.licenseNumber,
      vehicleType: payload.vehicleType,
    });

    if (data?.accessToken && data?.user) {
      setAccessToken(data.accessToken);
      setAuthCookies(data.accessToken, data.user.role);
    }

    return data;
  },

  getMe: async (): Promise<User> => {
    return api.get<User>("/users/me");
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Proceed with local logout regardless of network error
    } finally {
      setAccessToken(null);
      setAuthCookies(null, null);
    }
  },

  googleSignIn: async (idToken: string): Promise<AuthResponseData> => {
    const data = await api.post<AuthResponseData>("/auth/google", { idToken });

    if (data?.accessToken && data?.user) {
      setAccessToken(data.accessToken);
      setAuthCookies(data.accessToken, data.user.role);
    }

    return data;
  },
};

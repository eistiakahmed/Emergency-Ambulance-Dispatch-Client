import { api, setAccessToken } from "@/lib/api";
import type {
  LoginInput,
  RegisterDriverInput,
  RegisterPatientInput,
} from "@/lib/schemas/auth.schema";
import type { Role, User } from "@/types";

interface RawAuthResponse {
  user: User;
  accessToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken?: string;
  };
}

export interface AuthResponseData {
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
      token,
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `pulse_user_role=${encodeURIComponent(
      role,
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
    const raw = await api.post<RawAuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const token = raw?.accessToken || raw?.tokens?.accessToken || "";
    const user = raw?.user;

    if (token && user) {
      setAccessToken(token);
      setAuthCookies(token, user.role);
    }

    return {
      user,
      accessToken: token,
    };
  },

  registerPatient: async (
    payload: RegisterPatientInput,
  ): Promise<AuthResponseData> => {
    const raw = await api.post<RawAuthResponse>("/auth/register", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "PATIENT",
    });

    const token = raw?.accessToken || raw?.tokens?.accessToken || "";
    const user = raw?.user;

    if (token && user) {
      setAccessToken(token);
      setAuthCookies(token, user.role);
    }

    return {
      user,
      accessToken: token,
    };
  },

  registerDriver: async (
    payload: RegisterDriverInput,
  ): Promise<AuthResponseData> => {
    const raw = await api.post<RawAuthResponse>("/auth/register", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "DRIVER",
      licenseNumber: payload.licenseNumber,
      vehicleType: payload.vehicleType,
    });

    const token = raw?.accessToken || raw?.tokens?.accessToken || "";
    const user = raw?.user;

    if (token && user) {
      setAccessToken(token);
      setAuthCookies(token, user.role);
    }

    return {
      user,
      accessToken: token,
    };
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

  googleSignIn: async (
    idToken: string,
    role?: Role,
  ): Promise<AuthResponseData> => {
    const raw = await api.post<RawAuthResponse>("/auth/google", {
      idToken,
      ...(role ? { role } : {}),
    });

    const token = raw?.accessToken || raw?.tokens?.accessToken || "";
    const user = raw?.user;

    if (token && user) {
      setAccessToken(token);
      setAuthCookies(token, user.role);
    }

    return {
      user,
      accessToken: token,
    };
  },

  getGoogleClientId: async (): Promise<string> => {
    try {
      const res = await api.get<{ clientId: string }>("/auth/google-client-id");
      return res?.clientId || "";
    } catch {
      return "";
    }
  },
};

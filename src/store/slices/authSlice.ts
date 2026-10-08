import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { setAccessToken } from "@/lib/api";
import { setAuthCookies } from "@/lib/api/auth";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      setAccessToken(action.payload.accessToken);
      setAuthCookies(action.payload.accessToken, action.payload.user.role);
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      if (action.payload && state.accessToken) {
        setAuthCookies(state.accessToken, action.payload.role);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      setAccessToken(null);
      setAuthCookies(null, null);
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;

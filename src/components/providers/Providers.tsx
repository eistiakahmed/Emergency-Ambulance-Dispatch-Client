"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading } from "@/store/slices/authSlice";
import { api, getAccessToken } from "@/lib/api";
import type { User } from "@/types";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getAccessToken();
        // If we have a token or cookies, verify current user
        const userData = await api.get<User>("/auth/me", { skipAuthRefresh: false });
        if (userData) {
          dispatch(setUser(userData));
        } else {
          dispatch(setUser(null));
        }
      } catch {
        // Failed to restore session
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    }

    loadUser();
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "font-sans",
              style: {
                borderRadius: "0.75rem",
              },
            }}
          />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}

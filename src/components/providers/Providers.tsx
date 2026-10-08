"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { api, getAccessToken } from "@/lib/api";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setLoading, setUser } from "@/store/slices/authSlice";
import type { User } from "@/types";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getAccessToken();
        if (!token) {
          dispatch(setLoading(false));
          return;
        }
        // Restore session from backend profile endpoint
        const userData = await api.get<User>("/users/me", {
          skipAuthRefresh: false,
        });
        if (userData?.id) {
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
      }),
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

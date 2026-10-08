"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import type { Role, User } from "@/types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt?: (momentListener?: (notification: unknown) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (error: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  role?: Role;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  className?: string;
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

function GoogleSignInButtonInner({
  role = "PATIENT",
  text = "continue_with",
  className,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [clientId, setClientId] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  );
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch client ID fallback from backend if env var is missing
  useEffect(() => {
    if (!clientId) {
      authApi.getGoogleClientId().then((id) => {
        if (id) setClientId(id);
      });
    }
  }, [clientId]);

  // Unified authentication handler for both ID token (One-Tap) and Access token (OAuth popup)
  const handleAuthPayload = useCallback(
    async (payload: { idToken?: string; accessToken?: string }) => {
      try {
        setIsAuthenticating(true);
        const res = await authApi.googleSignIn(payload, role);

        if (res?.user && res?.accessToken) {
          dispatch(
            setCredentials({
              user: res.user,
              accessToken: res.accessToken,
            }),
          );

          toast.success(`Welcome, ${res.user.name}!`, {
            description: "Signed in with Google successfully.",
          });

          onSuccess?.(res.user);

          const target =
            redirectParam ||
            (res.user.role === "ADMIN"
              ? "/admin"
              : res.user.role === "DRIVER"
                ? "/provider"
                : "/dashboard");

          window.location.assign(target);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to authenticate with Google.";
        toast.error("Google Sign-In Failed", {
          description: message,
        });
        onError?.(message);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [dispatch, onError, onSuccess, redirectParam, role],
  );

  // Optional: Initialize Google One Tap in background
  useEffect(() => {
    if (
      !scriptLoaded ||
      typeof window === "undefined" ||
      !window.google?.accounts?.id ||
      !clientId
    ) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            handleAuthPayload({ idToken: response.credential });
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Silently request prompt for returning users
      window.google.accounts.id.prompt?.();
    } catch {
      // Non-blocking
    }
  }, [clientId, scriptLoaded, handleAuthPayload]);

  // Click handler for our native, full-width, perfectly styled button
  const handleCustomGoogleClick = () => {
    if (isAuthenticating) return;

    if (!clientId) {
      toast.error("Google Authentication Error", {
        description: "Google Client ID is not configured.",
      });
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      toast.info("Initializing Google...", {
        description: "Please wait a moment while the Google service connects.",
      });
      return;
    }

    try {
      setIsAuthenticating(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsAuthenticating(false);
            if (tokenResponse.error !== "popup_closed_by_user") {
              toast.error("Google Sign-In Error", {
                description:
                  tokenResponse.error_description || tokenResponse.error,
              });
            }
            return;
          }

          if (tokenResponse.access_token) {
            await handleAuthPayload({
              accessToken: tokenResponse.access_token,
            });
          } else {
            setIsAuthenticating(false);
          }
        },
        error_callback: (err) => {
          setIsAuthenticating(false);
          console.warn("Google OAuth error:", err);
        },
      });

      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err: unknown) {
      setIsAuthenticating(false);
      const message =
        err instanceof Error
          ? err.message
          : "Could not open Google authentication.";
      toast.error("Google Sign-In Failed", { description: message });
    }
  };

  const buttonLabel =
    text === "signup_with"
      ? "Sign up with Google"
      : text === "signin_with"
        ? "Sign in with Google"
        : "Continue with Google";

  return (
    <div className={cn("relative w-full py-1", className)}>
      <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <button
        type="button"
        onClick={handleCustomGoogleClick}
        disabled={isAuthenticating}
        className={cn(
          "relative w-full h-12 flex items-center justify-center gap-3 px-4",
          "rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100",
          "text-stone-700 font-semibold text-sm shadow-2xs hover:border-stone-400",
          "transition-all duration-150 active:scale-[0.99]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {isAuthenticating ? (
          <span className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm font-semibold">
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
            <span>Connecting with Google...</span>
          </span>
        ) : (
          <>
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Google logo"
            >
              <title>Google</title>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="truncate">{buttonLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}

export function GoogleSignInButton(props: GoogleSignInButtonProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("relative w-full py-1", props.className)}>
          <button
            type="button"
            disabled
            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl border border-stone-200 bg-white text-stone-400 font-semibold text-sm shadow-2xs opacity-75 cursor-wait"
          >
            <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
            <span>Continue with Google</span>
          </button>
        </div>
      }
    >
      <GoogleSignInButtonInner {...props} />
    </Suspense>
  );
}

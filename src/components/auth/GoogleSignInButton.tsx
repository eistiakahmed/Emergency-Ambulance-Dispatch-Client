"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
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
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
              locale?: string;
            },
          ) => void;
          prompt?: () => void;
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

export function GoogleSignInButton({
  role = "PATIENT",
  text = "continue_with",
  className,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const buttonRef = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  );
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch client ID from backend fallback if missing from env
  useEffect(() => {
    if (!clientId) {
      authApi.getGoogleClientId().then((id) => {
        if (id) setClientId(id);
      });
    }
  }, [clientId]);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response.credential) {
        toast.error("Google Authentication Failed", {
          description: "No authentication credential received from Google.",
        });
        return;
      }

      try {
        setIsAuthenticating(true);
        const res = await authApi.googleSignIn(response.credential, role);

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

  // Initialize and render Google button once SDK is loaded and Client ID is available
  useEffect(() => {
    if (
      !scriptLoaded ||
      typeof window === "undefined" ||
      !window.google ||
      !clientId ||
      !buttonRef.current
    ) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonRef.current.offsetWidth || 340,
        locale: "en",
      });
    } catch (e) {
      console.warn("Failed to render Google Sign-In button:", e);
    }
  }, [clientId, text, handleCredentialResponse, scriptLoaded]);

  return (
    <div className={cn("relative w-full py-1", className)}>
      <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {isAuthenticating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-xs border border-stone-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
            <span>Verifying with Google...</span>
          </div>
        </div>
      )}

      {/* Official Google Button Render Target */}
      <div
        ref={buttonRef}
        className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:!w-full [&>div>iframe]:!rounded-xl overflow-hidden min-h-[44px]"
      >
        {/* Placeholder / Pre-render skeleton while script loads */}
        {!scriptLoaded && (
          <button
            type="button"
            disabled
            className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-xl border border-stone-300 bg-white text-stone-700 font-medium text-xs sm:text-sm shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <svg
              className="h-4 w-4 shrink-0"
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
            <span>Continue with Google</span>
          </button>
        )}
      </div>
    </div>
  );
}

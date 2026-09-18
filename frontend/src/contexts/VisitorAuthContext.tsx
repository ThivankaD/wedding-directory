// src/context/VisitorAuthContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode

import { deleteCookie, isTokenValid } from "@/utils/cookieUtils";
import client from "@/apollo/apollo-client";
import request from "@/utils/request";

interface Visitor {
  id: string;
  email: string;
}

interface AuthContextProps {
  visitor: Visitor | null;
  accessToken: string | null;
  isAuthenticated: boolean; // Add isAuthenticated
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const logout = () => {
    // Clear visitor and accessToken state
    setVisitor(null);
    setAccessToken(null);
    // Delete cookies thoroughly across domain levels
    deleteCookie("access_token");
    deleteCookie("access_tokenVendor");
    // Clear Apollo store cache so previous session data does not leak
    client.clearStore().catch(() => {});
    // Notify server to clear cookies with server-side response headers
    request.post("/auth/logout").catch(() => {});
    // Redirect to home page
    router.push("/");
  };

  // Function to login by decoding JWT and extracting visitor details
  const login = (token: string) => {
    if (!isTokenValid(token)) {
      logout();
      return;
    }

    // Clear any vendor token to avoid conflicting auth state
    deleteCookie("access_tokenVendor");

    try {
      const decoded = jwtDecode<{ sub: string; email: string }>(token); // Expecting sub (visitor id) and email

      // Set access token in first-party cookie so Next.js middleware and browser can read it
      const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      document.cookie = `access_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax${isSecure ? '; Secure' : ''}`;

      // Set access token and visitor details in state
      setAccessToken(token);
      setVisitor({
        id: decoded.sub, // Assuming the sub is the visitor's ID
        email: decoded.email, // Email extracted from JWT
      });
    } catch (err) {
      console.error("Failed to decode visitor token:", err);
      logout();
    }
  };

  // Check if the visitor is authenticated
  const isAuthenticated = !!accessToken && !!visitor;

  useEffect(() => {
    // On page load, check if there is an access token in the cookies
    const storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));

    if (storedToken) {
      const token = storedToken.split("=")[1];
      if (isTokenValid(token)) {
        login(token);
      } else {
        // Expired or invalid token in cookie, purge it cleanly
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ visitor, accessToken, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

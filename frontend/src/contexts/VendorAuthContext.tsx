// src/context/VendorAuthContext.tsx
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

interface Vendor {
  id: string;
  email: string;
}

interface AuthContextProps {
  vendor: Vendor | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useVendorAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useVendorAuth must be used within a VendorAuthProvider");
  }
  return context;
};

export const VendorAuthProvider = ({ children }: { children: ReactNode }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const logout = () => {
    // Clear vendor and accessToken state
    setVendor(null);
    setAccessToken(null);
    // Delete cookies thoroughly across domain levels
    deleteCookie("access_tokenVendor");
    deleteCookie("access_token");
    // Clear Apollo store cache so previous session data does not leak
    client.clearStore().catch(() => {});
    // Notify server to clear cookies with server-side response headers
    request.post("/auth/logout").catch(() => {});
    // Redirect to home page
    router.push("/");
  };

  // Function to login by decoding JWT and extracting vendor details
  const login = (token: string) => {
    if (!isTokenValid(token)) {
      logout();
      return;
    }

    // Clear any visitor token to avoid conflicting auth state
    deleteCookie("access_token");

    try {
      const decoded = jwtDecode<{ sub: string; email: string }>(token); // Expecting sub (vendor id) and email

      // Set access token in first-party cookie so Next.js middleware and browser can read it
      const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      document.cookie = `access_tokenVendor=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax${isSecure ? '; Secure' : ''}`;

      // Set access token and vendor details in state
      setAccessToken(token);
      setVendor({
        id: decoded.sub, // Assuming the sub is the vendor's ID
        email: decoded.email, // Email extracted from JWT
      });
    } catch (err) {
      console.error("Failed to decode vendor token:", err);
      logout();
    }
  };

  // Check if the vendor is authenticated
  const isAuthenticated = !!accessToken && !!vendor;

  useEffect(() => {
    // On page load, check if there is an access tokenVendor in the cookies
    const storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_tokenVendor="));

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
      value={{ vendor, accessToken, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

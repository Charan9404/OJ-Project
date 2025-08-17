"use client";

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Keep a consistent backend URL name for anything that needs full redirects (e.g., Google OAuth)
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || "";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    try {
      console.log("Fetching user data...");
      // Backend mounts user router at /api/users -> call /users/* from the FE client
      const { data } = await api.get("users/me");
      console.log("User data response:", data);

      if (data?.success === false) throw new Error(data?.message || "Failed");

      // accept common shapes: {user} or {userData}
      const u = data?.user || data?.userData || null;
      if (!u) throw new Error("User not found in response");

      setUserData(u);
      return u;
    } catch (error) {
      console.log("User data fetch failed:", error.response?.status);
      if (error.response?.status !== 401) {
        toast.error(error.message || "Failed to fetch user data");
      }
      setUserData(null);
      return null;
    }
  };

  const getAuthState = async () => {
    try {
      console.log("Checking auth state...");
      // Do NOT prefix /api here; axios base handles it
      const { data } = await api.get("auth/is-auth");
      console.log("Auth response:", data);

      if (data?.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // 401 here just means "not logged in" — no toast
      console.log("Auth check failed:", error?.response?.status);
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth redirect and check auth state
  useEffect(() => {
    console.log("AppContext useEffect triggered");

    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");

    if (authStatus === "success") {
      console.log("Google OAuth success detected");
      setIsLoggedin(true);
      getUserData().finally(() => setIsLoading(false));
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Successfully signed in with Google! 🎉");
    } else if (authStatus === "error") {
      console.log("Google OAuth error detected");
      toast.error("Google sign-in failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsLoading(false);
    } else {
      console.log("Normal auth state check");
      getAuthState();
    }
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    isLoading,
  };

  console.log("AppContext state:", {
    isLoading,
    isLoggedin,
    userData: !!userData,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

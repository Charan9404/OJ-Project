"use client";

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Provide a defined value so consumers never see undefined
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthState = async () => {
    try {
      console.log("Checking auth state...");
      const { data } = await api.get("/api/auth/is-auth");
      console.log("Auth response:", data);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.log("Auth check failed:", error.response?.status);
      if (error.response?.status !== 401) {
        console.error("Auth check error:", error);
      }
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      console.log("Fetching user data...");
      const { data } = await api.get("/api/user/data");
      console.log("User data response:", data);

      if (data.success) {
        setUserData(data.userData);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("User data fetch failed:", error.response?.status);
      if (error.response?.status !== 401) {
        toast.error(error.message || "Failed to fetch user data");
      }
      setUserData(null);
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

// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="pt-16">{children}</main>{" "}
      {/* Push content below navbar */}
    </div>
  );
};

export default Layout;

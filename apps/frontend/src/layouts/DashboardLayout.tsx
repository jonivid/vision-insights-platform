// src/layouts/DashboardLayout.tsx
import React from "react";
import { Header } from "../components/Layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps pages in a consistent dashboard frame:
 *  - Renders the global <Header>
 *  - Centers content in a main container
 *  - Can be extended with sidebars, footers, etc.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Global navigation / branding */}
      <Header />

      {/* Main content area */}
      <main style={{ flex: 1, padding: "24px", background: "#f5f5f5" }}>
        {children}
      </main>
    </div>
  );
};

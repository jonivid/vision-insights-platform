import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { Header } from "./components/Layout/Header";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

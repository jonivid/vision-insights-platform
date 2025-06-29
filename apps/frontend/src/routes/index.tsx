import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../pages/ListPage";
import DetailPage from "../pages/DetailPage";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/videos" replace />} />
        <Route path="/videos" element={<ListPage />} />
        <Route path="/videos/:id" element={<DetailPage />} />
      </Routes>
    </>
  );
}

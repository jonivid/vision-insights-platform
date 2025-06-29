// src/config/index.ts

/**
 * Centralized app configuration.
 * Pulls from Vite’s import.meta.env,
 * and falls back to sensible defaults for local dev.
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
  wsUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:3001",
  // e.g., future feature flags:
  // enableBetaFeatures: import.meta.env.VITE_ENABLE_BETA === 'true',
};

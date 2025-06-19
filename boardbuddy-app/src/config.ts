// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.DEV
      ? "http://localhost:8082/api"
      : "https://lczm.me/boardbuddy/api",
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

import { createNeonAuth } from "@neondatabase/auth/next/server";
const baseUrl = process.env.IDENTITY_NEON_AUTH_BASE_URL;
export const managedAuth = baseUrl?.startsWith("https://") && process.env.AUTH_SECRET ? createNeonAuth({ baseUrl, cookies: { secret: process.env.AUTH_SECRET, sessionDataTtl: 60 } }) : null;

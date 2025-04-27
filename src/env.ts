import "dotenv/config";

const DEFAULTS = {
  PORT: 3000,
  DIRECTUS_URL: "https://luxeenbois.com",
  PUBLIC_URL: "http://localhost:300",
  DIRECTUS_COOKIE_NAME: "directus_session_token",
};

const userDefined = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key in DEFAULTS)
);

export const env = Object.assign({}, DEFAULTS, userDefined);
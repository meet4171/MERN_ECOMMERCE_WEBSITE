export const APP_MODE = "production";

export const BASE_URL = APP_MODE === "production"
    ? "https://www.meetjadav.shop"
    : "http://localhost:3000";

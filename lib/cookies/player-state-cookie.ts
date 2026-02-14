"use client";

const COOKIE_NAME = "listenly_player_state";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const encodeValue = (value: unknown) => {
  try {
    return encodeURIComponent(JSON.stringify(value));
  } catch {
    return "";
  }
};

const decodeValue = (value: string) => {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
};

export const setPlayerStateCookie = (value: unknown) => {
  if (typeof document === "undefined") return;
  const encoded = encodeValue(value);
  if (!encoded) return;
  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
};

export const getPlayerStateCookie = <T>() => {
  if (typeof document === "undefined") return null as T | null;
  const cookies = document.cookie.split("; ");
  const target = cookies.find((item) => item.startsWith(`${COOKIE_NAME}=`));
  if (!target) return null as T | null;
  const value = target.substring(COOKIE_NAME.length + 1);
  return decodeValue(value) as T | null;
};

export const clearPlayerStateCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
};

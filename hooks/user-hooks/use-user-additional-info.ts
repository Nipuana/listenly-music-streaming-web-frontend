import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import {
  addUserInfo,
  getUserInfo,
  clearUserInfo,
} from "../../lib/api/api-calls/user_APIs/auth_APIs/user-info";

export type AdditionalInfo = {
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null; // ISO date string
  age?: number | null;
  bio?: string | null;
};

type Listener = (info: AdditionalInfo | null) => void;

const additionalInfoCache: Map<string, AdditionalInfo | null> = new Map();
const additionalInfoLoading: Map<string, boolean> = new Map();
const additionalInfoError: Map<string, any> = new Map();
const additionalInfoListeners: Map<string, Set<Listener>> = new Map();

function notifyListeners(key: string, value: AdditionalInfo | null) {
  const set = additionalInfoListeners.get(key);
  if (!set) return;
  for (const fn of set) fn(value);
}

async function fetchAdditionalInfoForKey(key: string) {
  additionalInfoLoading.set(key, true);
  additionalInfoError.delete(key);
  try {
    const res: AxiosResponse | any = await getUserInfo();
    // API may return the full object or { additionalInfo }
    let raw: any = null;
    if (!res) raw = null;
    else if (res.data) raw = res.data.additionalInfo ?? res.data;
    else raw = res.additionalInfo ?? res;

    // pick only allowed fields and coerce types
    const info: AdditionalInfo | null = raw
      ? {
          phoneNumber: raw.phoneNumber ?? null,
          address: raw.address ?? null,
          city: raw.city ?? null,
          country: raw.country ?? null,
          postalCode: raw.postalCode ?? null,
          gender: raw.gender ?? null,
          dateOfBirth: raw.dateOfBirth ?? null,
          age: raw.age !== undefined && raw.age !== null ? Number(raw.age) : null,
          bio: raw.bio ?? null,
        }
      : null;
    additionalInfoCache.set(key, info ?? null);
    notifyListeners(key, info ?? null);
    return info ?? null;
  } catch (err) {
    additionalInfoError.set(key, err);
    throw err;
  } finally {
    additionalInfoLoading.set(key, false);
  }
}

export default function useUserAdditionalInfo(key = "me") {
  const cacheKey = key || "me";
  const [info, setInfo] = useState<AdditionalInfo | null>(() =>
    additionalInfoCache.has(cacheKey)
      ? (additionalInfoCache.get(cacheKey) as AdditionalInfo | null)
      : null
  );
  const [loading, setLoading] = useState<boolean>(
    additionalInfoLoading.get(cacheKey) || false
  );
  const [error, setError] = useState<any>(additionalInfoError.get(cacheKey));

  useEffect(() => {
    let mounted = true;
    // listener to update local state when cache changes
    const listener: Listener = (val) => {
      if (!mounted) return;
      setInfo(val);
      setLoading(false);
      setError(undefined);
    };

    // ensure listener set exists
    if (!additionalInfoListeners.has(cacheKey))
      additionalInfoListeners.set(cacheKey, new Set());
    additionalInfoListeners.get(cacheKey)!.add(listener);

    // if there's no cached value and not currently loading, fetch
    if (!additionalInfoCache.has(cacheKey) && !additionalInfoLoading.get(cacheKey)) {
      setLoading(true);
      fetchAdditionalInfoForKey(cacheKey)
        .then((res) => {
          if (!mounted) return;
          setInfo(res);
          setError(undefined);
        })
        .catch((err) => {
          if (!mounted) return;
          setError(err);
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    }

    // hydrate from cache if available
    const cached = additionalInfoCache.get(cacheKey) ?? null;
    if (cached !== undefined && cached !== null) setInfo(cached);

    return () => {
      mounted = false;
      const set = additionalInfoListeners.get(cacheKey);
      set?.delete(listener);
    };
  }, [cacheKey]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetchAdditionalInfoForKey(cacheKey);
      setInfo(res);
      setError(undefined);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function saveAdditionalInfo(payload: Partial<AdditionalInfo>) {
    setLoading(true);
    try {
      // sanitize payload: only allowed fields, remove empty strings
      const allowed: Record<string, any> = {
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        city: payload.city,
        country: payload.country,
        postalCode: payload.postalCode,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        age: payload.age === null || payload.age === undefined ? undefined : Number(payload.age),
        bio: payload.bio,
      };
      const sanitized: Record<string, any> = Object.fromEntries(
        Object.entries(allowed).filter(([, v]) => v !== undefined && v !== null && v !== "")
      );

      const res: AxiosResponse | any = await addUserInfo(sanitized);
      let updated: AdditionalInfo | null = null;
      if (res?.data) updated = res.data.additionalInfo ?? res.data;
      else updated = res.additionalInfo ?? res;
      additionalInfoCache.set(cacheKey, updated ?? null);
      notifyListeners(cacheKey, updated ?? null);
      setInfo(updated ?? null);
      setError(undefined);
      return updated ?? null;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function clearAdditional() {
    setLoading(true);
    try {
      await clearUserInfo();
      additionalInfoCache.set(cacheKey, null);
      notifyListeners(cacheKey, null);
      setInfo(null);
      setError(undefined);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    additionalInfo: info,
    loading,
    error,
    refresh,
    saveAdditionalInfo,
    clearAdditional,
  } as const;
}

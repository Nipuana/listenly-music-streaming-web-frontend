"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAllCookies, getAuthToken, getUserData } from "@/lib/cookies/user-data-cookie";
import { clearPlayerStateCookie } from "@/lib/cookies/player-state-cookie";
import { clearRecentSongs } from "@/lib/cookies/recent-songs-cookie";
import { clearGenreCounters } from "@/lib/cookies/genre-counters-cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


const clearClientCookies = () => {
    if (typeof document === "undefined") return;
    const cookieList = document.cookie ? document.cookie.split("; ") : [];
    const expires = new Date(0).toUTCString();

    cookieList.forEach((cookie) => {
        const name = cookie.split("=")[0];
        document.cookie = `${name}=; expires=${expires}; path=/; samesite=lax`;
    });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const checkAuth = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                // Clear all cookies if token is absent
                await clearAllCookies();
                clearClientCookies();
                clearPlayerStateCookie();
                clearRecentSongs();
                clearGenreCounters();
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }
            const user = await getUserData();
            setUser(user);
            setIsAuthenticated(!!token);
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            // client-side clear only (HttpOnly cookies cannot be removed from JS)
            clearClientCookies();
            clearPlayerStateCookie();
            clearRecentSongs();
            clearGenreCounters();

            setIsAuthenticated(false);
            setUser(null);
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
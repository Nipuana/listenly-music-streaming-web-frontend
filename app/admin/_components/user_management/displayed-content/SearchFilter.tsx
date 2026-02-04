import React from "react";
import { Search, Users, ShieldCheck, Mic2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type RoleCounts = { all: number; user: number; admin: number; artist: number };

type SearchFilterProps = {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  roleFilter: string;
  setRoleFilter: (s: string) => void;
  roleCounts: RoleCounts;
};

export default function SearchFilter({ searchQuery, setSearchQuery, roleFilter, setRoleFilter, roleCounts }: SearchFilterProps) {
  return (
    <div className="mb-4">
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      <div className="flex gap-2 p-2 bg-muted rounded-xl">
        <button
          onClick={() => setRoleFilter('all')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            roleFilter === 'all' ? 'bg-primary text-primary-foreground shadow-primary' : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            All Users
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.all}</span>
          </span>
        </button>

        <button
          onClick={() => setRoleFilter('user')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            roleFilter === 'user' ? 'bg-primary text-primary-foreground shadow-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Users
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.user}</span>
          </span>
        </button>

        <button
          onClick={() => setRoleFilter('admin')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            roleFilter === 'admin' ? 'bg-primary text-primary-foreground shadow-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Admins
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{roleCounts.admin}</span>
          </span>
        </button>

        <button
          onClick={() => setRoleFilter('artist')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            roleFilter === 'artist' ? 'bg-primary text-primary-foreground shadow-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Mic2 className="w-4 h-4" />
            Artists
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{roleCounts.artist}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

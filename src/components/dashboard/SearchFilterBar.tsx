"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface SearchFilterBarProps {
  placeholder?: string;
  searchParamKey?: string;
  filterGroups?: FilterGroup[];
  className?: string;
}

export function SearchFilterBar({
  placeholder = "Search records...",
  searchParamKey = "search",
  filterGroups = [],
  className,
}: SearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get(searchParamKey) || "";
  const [inputValue, setInputValue] = useState(currentSearch);

  // Helper to update query params and reset page to 1
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim() !== "") {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }
    // Always reset page to 1 when changing search or filters
    params.delete("page");

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery(searchParamKey, inputValue);
  };

  const handleClearSearch = () => {
    setInputValue("");
    updateQuery(searchParamKey, null);
  };

  const hasActiveFilters =
    Boolean(searchParams.get(searchParamKey)) ||
    filterGroups.some((group) => Boolean(searchParams.get(group.key)));

  const handleResetAll = () => {
    setInputValue("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-2xs",
        className
      )}
    >
      {/* Search Input Box */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 flex items-center"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          prefixIcon={<Search className="h-4 w-4 text-stone-400" />}
          className="h-10 bg-stone-50/70 border-stone-200 pr-16 focus:bg-white text-xs sm:text-sm"
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-12 text-stone-400 hover:text-stone-600 p-1"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="absolute right-1.5 h-7 px-2.5 text-xs font-bold"
        >
          Search
        </Button>
      </form>

      {/* Filter Select Dropdowns */}
      {filterGroups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filterGroups.map((group) => {
            const activeValue = searchParams.get(group.key) || "";

            return (
              <div key={group.key} className="relative">
                <select
                  value={activeValue}
                  onChange={(e) => updateQuery(group.key, e.target.value || null)}
                  className="h-10 px-3 py-1 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50/70 text-stone-700 hover:bg-white hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                >
                  <option value="">{group.label} (All)</option>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="h-10 px-3 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 gap-1.5"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
}

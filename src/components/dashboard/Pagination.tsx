"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  limit?: number;
  paramKey?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  limit,
  paramKey = "page",
  className,
}: PaginationProps) {
  const effectivePageSize = limit || pageSize;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goToPage = (pageNumber: number) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, pageNumber.toString());
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const startItem = (currentPage - 1) * effectivePageSize + 1;
  const endItem = totalItems
    ? Math.min(currentPage * effectivePageSize, totalItems)
    : currentPage * effectivePageSize;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600",
        className,
      )}
    >
      {/* Information text */}
      <div>
        {totalItems !== undefined ? (
          <span>
            Showing{" "}
            <strong className="font-bold text-stone-900">{startItem}</strong> to{" "}
            <strong className="font-bold text-stone-900">{endItem}</strong> of{" "}
            <strong className="font-bold text-stone-900">{totalItems}</strong>{" "}
            entries
          </span>
        ) : (
          <span>
            Page{" "}
            <strong className="font-bold text-stone-900">{currentPage}</strong>{" "}
            of{" "}
            <strong className="font-bold text-stone-900">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="h-8 px-2.5 gap-1 text-xs font-semibold"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Show first, last, and pages near current
              return (
                p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
              );
            })
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;

              return (
                <React.Fragment key={p}>
                  {showEllipsis && (
                    <span className="px-1 text-stone-400 font-bold">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToPage(p)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                      p === currentPage
                        ? "bg-stone-900 text-white shadow-2xs"
                        : "text-stone-700 hover:bg-stone-100",
                    )}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="h-8 px-2.5 gap-1 text-xs font-semibold"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

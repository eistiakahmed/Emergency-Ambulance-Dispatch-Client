import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-stone-200 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-stone-200/80 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-stone-200/80 rounded-3xl" />
      <div className="h-80 bg-stone-200/80 rounded-2xl" />
    </div>
  );
}

export default function DriverLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-stone-200/80 rounded-2xl" />
      <div className="h-72 bg-stone-200/80 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-stone-200/80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

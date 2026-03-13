export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-7 w-32 rounded bg-gray-300" />
        <div className="h-3 w-40 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 animate-pulse">
      <div className="h-5 w-40 rounded bg-gray-200 mb-4" />
      <div className="h-[250px] sm:h-[300px] w-full rounded-lg bg-gray-200" />
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-slate-200">
        <div className="h-3 w-16 rounded bg-gray-300" />
        <div className="h-3 w-32 rounded bg-gray-300" />
        <div className="h-3 w-20 rounded bg-gray-300 hidden sm:block" />
        <div className="h-3 w-20 rounded bg-gray-300 hidden sm:block" />
        <div className="h-3 w-16 rounded bg-gray-300 hidden md:block" />
        <div className="h-3 w-16 rounded bg-gray-300 hidden md:block" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 last:border-b-0"
        >
          <div className="h-3.5 w-14 rounded bg-gray-200" />
          <div className="h-3.5 w-36 rounded bg-gray-200" />
          <div className="h-3.5 w-16 rounded bg-gray-200 hidden sm:block" />
          <div className="h-3.5 w-20 rounded bg-gray-200 hidden sm:block" />
          <div className="h-3.5 w-16 rounded bg-gray-200 hidden md:block" />
          <div className="h-3.5 w-14 rounded bg-gray-200 hidden md:block" />
        </div>
      ))}
    </div>
  );
}

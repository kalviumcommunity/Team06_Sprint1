"use client";

interface Props {
  progress: number;
}

export default function RefillProgress({
  progress,
}: Props) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-sm">

        <span>
          Refill Progress
        </span>

        <span>
          {progress}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}
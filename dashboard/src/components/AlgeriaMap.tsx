const LON_MIN = -5.0;
const LON_MAX = 11.9;
const LAT_MAX = 36.9;
const LAT_MIN = 19.1;

const ALGERIA_PATH =
  "M 17.2 10.1 L 26.0 6.7 L 47.3 0.6 L 59.8 0.6 L 75.7 0.0 L 79.3 9.6 L 78.1 16.3 L 84.6 20.8 L 89.9 26.4 L 100.0 75.3 L 55.0 100.0 L 1.8 66.9 L 0.0 54.5 L 4.6 45.0 L 9.0 36.0 Z";

function lonLatToXY(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x, y };
}

type AlgeriaMapProps = {
  longitude?: number | null;
  latitude?: number | null;
  label?: string | null;
  className?: string;
};
export default function AlgeriaMap({
  longitude,
  latitude,
  label,
  className,
}: AlgeriaMapProps) {
  const hasPin = longitude != null && latitude != null;
  const pin = hasPin ? lonLatToXY(longitude!, latitude!) : null;

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full drop-shadow"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Map of Algeria"
      >
        <path
          d={ALGERIA_PATH}
          fill="#f7e7ce"
          stroke="#b08d2e"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>

      {pin && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="flex items-center gap-1 rounded-full bg-sea-foam px-2 py-0.5 text-[10px] font-semibold text-pine shadow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rustic-gold" />
              {label ?? "Artisan"}
            </div>
            <svg
              className="-mt-0.5 h-4 w-4 text-pine"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

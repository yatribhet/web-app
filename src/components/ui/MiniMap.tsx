interface MiniMapProps {
  latitude: number;
  longitude: number;
}

export function MiniMap({ latitude, longitude }: MiniMapProps) {
  return (
    <div className="h-[160px] relative overflow-hidden rounded-md bg-[#d4e8d4] dark:bg-[#1a2e1a]">
      {/* CSS grid pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(#4a7c59 1px, transparent 1px), linear-gradient(90deg, #4a7c59 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Crossing roads */}
      <div className="absolute top-1/2 left-0 w-full h-[6px] bg-white/60 -translate-y-1/2" />
      <div className="absolute left-1/2 top-0 h-full w-[6px] bg-white/60 -translate-x-1/2" />

      {/* Pin centered */}
      <div className="absolute top-1/2 left-1/2 -mt-2 -ml-2 w-4 h-4 bg-ember rotate-45 border-2 border-white dark:border-[#1e1912] shadow-sm flex items-center justify-center" />

      {/* Overlay box */}
      <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-black/60 shadow-sm px-2 py-0.5 rounded backdrop-blur">
        <span className="text-[10px] text-ink dark:text-[#f5ede4]">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

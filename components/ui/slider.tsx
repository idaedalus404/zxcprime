"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface Segment {
  start_sec: number;
  end_sec: number;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  color,
  intro,
  outro,
  buffered,
  showTooltip = false,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  color?: string;
  intro?: Segment | null;
  outro?: Segment | null;
  buffered?: number;
  showTooltip?: boolean;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [hover, setHover] = React.useState<{ x: number; time: number } | null>(
    null,
  );

  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / rect.width),
    );
    setHover({ x: ratio * rect.width, time: ratio * max });
  };

  const clearHover = () => setHover(null);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      onMouseMove={handleHover}
      onMouseLeave={clearHover}
    >
      {showTooltip && hover !== null && (
        <div
          className={cn(
            "absolute -top-8 px-2 py-1 text-sm rounded",
            "bg-background/70 backdrop-blur-2xl text-foreground",
            "pointer-events-none z-40",
          )}
          style={{ left: hover.x, transform: "translateX(-50%)" }}
        >
          {formatTime(hover.time)}
        </div>
      )}

      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col cursor-pointer py-3 ",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative grow overflow-hidden rounded-full",
            "bg-foreground/20",
            "origin-center",
            "h-1.5 landscape:h-1",
            "transition-transform duration-200 ease-out",
            "group-hover:scale-y-[1.67]",
            "data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
          )}
        >
          {typeof buffered === "number" && max > 0 && (
            <div
              className="absolute inset-y-0 left-0 rounded-sm pointer-events-none bg-muted-foreground/50"
              style={{ width: `${(buffered / max) * 100}%` }}
            />
          )}

          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute select-none data-horizontal:h-full data-vertical:w-full rounded-sm"
            style={{ backgroundColor: `#${color}` }}
          />
        </SliderPrimitive.Track>

        {intro && max > 0 && (
          <div
            className="absolute h-1.5 origin-center scale-y-100 group-hover:scale-y-[1.67] transition-transform duration-200 ease-out rounded-xs pointer-events-none"
            style={{
              left: `${(intro.start_sec / max) * 100}%`,
              width: `${((intro.end_sec - intro.start_sec) / max) * 100}%`,
              backgroundColor: "#facc15",
            }}
          />
        )}
        {outro && max > 0 && (
          <div
            className="absolute h-1.5 origin-center scale-y-100 group-hover:scale-y-[1.67] transition-transform duration-200 ease-out rounded-xs pointer-events-none"
            style={{
              left: `${(outro.start_sec / max) * 100}%`,
              width: `${((outro.end_sec - outro.start_sec) / max) * 100}%`,
              backgroundColor: "#fb923c",
            }}
          />
        )}

        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="md:opacity-0 opacity-100 group-hover:opacity-100  duration-200 border-ring ring-ring/50 relative md:h-5 h-4 md:w-2 w-1.5 landscape:w-1 landscape:h-2 rounded-full border bg-white after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };

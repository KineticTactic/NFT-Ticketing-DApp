import { useEffect, useRef } from "react";
import seedrandom from "seedrandom";
import { SVG } from "@svgdotjs/svg.js";

export default function GenerativeSVG({ seed = "" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const { width, height } = container.getBoundingClientRect();

    // Seed Math.random deterministically
    seedrandom(seed, { global: true });

    const colors = [
      "#e63946",
      "#f1faee",
      "#a8dadc",
      "#457b9d",
      "#1d3557",
      "#ffbe0b",
      "#fb5607",
      "#8338ec",
      "#3a86ff",
    ];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const draw = SVG()
      .addTo(container)
      .viewbox(0, 0, width, height)
      .size("100%", "100%");

    // Background
    draw.rect(width, height).fill(pick(colors));

    const shapeCount = Math.floor(rand(10, 18));

    for (let i = 0; i < shapeCount; i++) {
      const strokeWidth = rand(1, 6);
      const opacity = rand(0.6, 0.95);

      if (Math.random() > 0.5) {
        draw
          .circle(rand(40, width * 0.3))
          .move(rand(0, width), rand(0, height))
          .fill(pick(colors))
          .stroke({ color: pick(colors), width: strokeWidth })
          .opacity(opacity);
      } else {
        draw
          .rect(rand(40, width * 0.4), rand(40, height * 0.4))
          .move(rand(0, width), rand(0, height))
          .radius(rand(0, 30))
          .fill(pick(colors))
          .stroke({ color: pick(colors), width: strokeWidth })
          .opacity(opacity);
      }
    }

    return () => {
      draw.clear();
    };
  }, [seed]);

  return <div ref={containerRef} className="w-full h-full" />;
}

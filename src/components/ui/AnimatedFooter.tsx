"use client";

import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Animated Footer / Cinematic ASCII Scroll Reveal Band
 *
 * Adapted for Vite + React: two source images are re-drawn as live ASCII art
 * on <canvas>, light up in clusters around the cursor, and drift with a soft
 * parallax. When scrolled into view, the display headings unmask character-by-character
 * from the center and the ASCII visuals glide in from the edges.
 */

export interface AnimatedFooterLink {
  label: string;
  href: string;
}

export interface AnimatedFooterProps {
  /** The large display words along the bottom edge. Defaults to ["DIVE INTO", "VISION"]. */
  headingLines?: string[];
  /** Left image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  leftImage?: string;
  /** Right image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  rightImage?: string;

  /** Background color. Defaults to "#080807". */
  background?: string;
  /** Text color for headings. Defaults to "#F8ECAB". */
  textColor?: string;

  /** Character ramp, ordered dark -> light, used to render the ASCII art. */
  asciiChars?: string;
  /** Color of the ASCII glyphs. Defaults to "#8E6C1E". */
  charColor?: string;
  /** Fill color of a highlighted (hovered) cell. Defaults to "#DAB24C". */
  hoverColor?: string;
  /** Glyph color inside a highlighted cell. Defaults to "#080807". */
  hoverCharColor?: string;
  /** Number of columns each image is sampled to. Defaults to 64. */
  columns?: number;
  /** Pixel size of each ASCII cell. Defaults to 14. */
  cellSize?: number;
  /** Font size (px) of the ASCII glyphs. Defaults to 13. */
  fontSize?: number;

  /** Pointer parallax strength in px; set to 0 to disable. Defaults to 22. */
  parallaxStrength?: number;
  /** Cursor influence radius, in cells, for the hover highlight. Defaults to 7. */
  hoverRadius?: number;

  /** Play the reveal when scrolled into view (else shows immediately). Defaults to true. */
  revealOnScroll?: boolean;
  /** Controlled reveal override. */
  revealed?: boolean;

  /** Extra class names for the root element. */
  className?: string;
}

const DEFAULT_ASCII_CHARS = "........:::=+xX#0369";

const HIGHLIGHT_LIFETIME = 300;
const CLUSTER_SIZE = 10;
const PARALLAX_EASE = 0.05;

interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
  columns: number;
  cellSize: number;
  baselineOffset: number;
  direction: 1 | -1;
}

function buildHandCells(
  image: HTMLImageElement,
  columns: number,
  asciiChars: string,
): { rows: number; cells: Map<string, Cell> } {
  const rows = Math.max(
    1,
    Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)),
  );

  const sampler = document.createElement("canvas");
  sampler.width = columns;
  sampler.height = rows;
  const sampleCtx = sampler.getContext("2d");
  const cells = new Map<string, Cell>();
  if (!sampleCtx) return { rows, cells };

  sampleCtx.drawImage(image, 0, 0, columns, rows);
  const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  const backgroundCharIndex = asciiChars.lastIndexOf(".");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        asciiChars.length - 1,
        Math.floor((1 - brightness) * asciiChars.length),
      );
      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: asciiChars[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

function highlightCluster(cells: Map<string, Cell>, startCell: Cell) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
}

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return el;
    el = el.parentElement;
  }
  return null;
}

export function AnimatedFooter({
  headingLines = ["DIVE INTO", "VISION"],
  leftImage = "/images/div-seal.jpg",
  rightImage = "/images/div-seal.jpg",
  background = "#080807",
  textColor = "#F8ECAB",
  charColor = "#8E6C1E",
  hoverColor = "#DAB24C",
  hoverCharColor = "#080807",
  asciiChars = DEFAULT_ASCII_CHARS,
  columns = 64,
  cellSize = 14,
  fontSize = 13,
  parallaxStrength = 22,
  hoverRadius = 7,
  revealOnScroll = true,
  revealed,
  className,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const animateInRef = useRef<() => void>(() => {});
  const animateOutRef = useRef<() => void>(() => {});

  const liveRef = useRef({
    charColor,
    hoverColor,
    hoverCharColor,
    parallaxStrength,
    hoverRadius,
  });

  useEffect(() => {
    liveRef.current = {
      charColor,
      hoverColor,
      hoverCharColor,
      parallaxStrength,
      hoverRadius,
    };
  }, [charColor, hoverColor, hoverCharColor, parallaxStrength, hoverRadius]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        leftImage,
        rightImage,
        columns,
        cellSize,
        fontSize,
        asciiChars,
        revealOnScroll,
        headingLines,
      }),
    [
      leftImage,
      rightImage,
      columns,
      cellSize,
      fontSize,
      asciiChars,
      revealOnScroll,
      headingLines,
    ],
  );

  useEffect(() => {
    const root = rootRef.current;
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;

    const hands: Hand[] = [];
    const wrappers = [leftWrap, rightWrap];

    const setupHand = (
      image: HTMLImageElement,
      canvas: HTMLCanvasElement,
      direction: 1 | -1,
    ) => {
      const { rows, cells } = buildHandCells(image, columns, asciiChars);
      if (cells.size === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = columns * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const metrics = ctx.measureText("X");
      const glyphHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset =
        cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

      hands.push({
        canvas,
        ctx,
        cells,
        cellList: [...cells.values()],
        rows,
        columns,
        cellSize,
        baselineOffset,
        direction,
      });
    };

    const loadHand = (
      src: string,
      canvas: HTMLCanvasElement | null,
      direction: 1 | -1,
    ) => {
      if (!src || !canvas) return;
      const image = new Image();
      image.crossOrigin = "anonymous";
      let initialized = false;
      const init = () => {
        if (initialized) return;
        initialized = true;
        setupHand(image, canvas, direction);
      };
      image.onload = init;
      image.src = src;
      if (image.complete && image.naturalWidth) init();
    };
    loadHand(leftImage, leftCanvasRef.current, 1);
    loadHand(rightImage, rightCanvasRef.current, -1);

    const renderHand = (hand: Hand, now: number) => {
      const {
        ctx,
        cellList,
        cellSize: cs,
        baselineOffset,
        columns: cols,
        rows,
      } = hand;
      const { charColor: cc, hoverColor: hc, hoverCharColor: hcc } =
        liveRef.current;
      ctx.clearRect(0, 0, cols * cs, rows * cs);

      for (const cell of cellList) {
        const x = cell.col * cs;
        const y = cell.row * cs;
        const isHighlighted = cell.highlightEndTime > now;

        if (isHighlighted) {
          ctx.fillStyle = hc;
          ctx.fillRect(x, y, cs, cs);
        }
        ctx.fillStyle = isHighlighted ? hcc : cc;
        ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
      }
    };

    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const curtain = { offset: revealOnScroll ? 125 : 0 };

    const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
      const rect = hand.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

      let closest: Cell | null = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }
      if (closest && closestDist <= liveRef.current.hoverRadius) {
        highlightCluster(hand.cells, closest);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const strength = liveRef.current.parallaxStrength;
      const rect = root.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
      pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
      for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let rafId = 0;
    const frame = () => {
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);

      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      const strength = liveRef.current.parallaxStrength;
      const scale = 1 + (strength * 2) / 200;

      wrappers.forEach((wrapper, i) => {
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        const x = drift.x * dir || 0;
        const y = -drift.y || 0;
        wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const chars = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-af-char]"),
    );

    const animateIn = () => {
      gsap.to(curtain, {
        offset: 0,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.04, from: "center" },
        overwrite: true,
      });
    };

    const animateOut = () => {
      gsap.to(curtain, {
        offset: 125,
        duration: 0.4,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.to(chars, {
        yPercent: 125,
        duration: 0.4,
        ease: "power2.in",
        stagger: { each: 0.01, from: "center" },
        overwrite: true,
      });
    };

    animateInRef.current = animateIn;
    animateOutRef.current = animateOut;

    const maskAll = () => {
      gsap.set(chars, { yPercent: 125 });
    };
    const showAll = () => {
      gsap.set(chars, { yPercent: 0 });
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let observer: IntersectionObserver | null = null;

    if (prefersReducedMotion) {
      curtain.offset = 0;
      showAll();
    } else if (revealed !== undefined) {
      curtain.offset = revealed ? 0 : 125;
      if (revealed) showAll();
      else maskAll();
    } else if (revealOnScroll) {
      maskAll();
      let isRevealed = false;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isRevealed) {
              isRevealed = true;
              animateIn();
            } else if (!entry.isIntersecting && isRevealed) {
              isRevealed = false;
              animateOut();
            }
          }
        },
        { root: getScrollParent(root), threshold: 0.25 },
      );
      observer.observe(root);
    } else {
      showAll();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer?.disconnect();
      gsap.killTweensOf([curtain, ...chars]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  useEffect(() => {
    if (revealed === undefined) return;
    if (revealed) animateInRef.current();
    else animateOutRef.current();
  }, [revealed]);

  const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
  const offEdge = startsHidden ? 125 : 0;

  return (
    <section
      ref={rootRef}
      aria-label="Interactive ASCII ecosystem showcase"
      className={cn(
        "relative h-full w-full overflow-hidden",
        className,
      )}
      style={{
        backgroundColor: background,
        color: textColor,
        containerType: "inline-size",
      }}
    >
      {/* ASCII twin emblems */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 sm:px-10">
        <div
          ref={leftWrapRef}
          className="relative w-2/5 max-w-[420px] min-w-[180px] opacity-85 will-change-transform"
          style={{ transform: `translateX(-${offEdge}%)` }}
        >
          <canvas ref={leftCanvasRef} className="block h-auto w-full" />
        </div>
        <div
          ref={rightWrapRef}
          className="relative w-2/5 max-w-[420px] min-w-[180px] opacity-85 will-change-transform"
          style={{ transform: `translateX(${offEdge}%)` }}
        >
          <canvas ref={rightCanvasRef} className="block h-auto w-full" />
        </div>
      </div>

      {/* Display headings */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end gap-1 px-6 pt-12 pb-8 sm:pb-12">
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-[#DAB24C] uppercase">
          MOVE CURSOR TO ILLUMINATE · SCROLL REVEAL
        </p>
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-2 text-center">
          {headingLines.map((word, wi) => (
            <h2
              key={`${word}-${wi}`}
              aria-label={word}
              className="overflow-hidden font-display font-bold leading-none tracking-tight pb-[0.12em] -mb-[0.12em]"
              style={{ fontSize: "clamp(2.25rem, 8.5cqw, 7.5rem)" }}
            >
              {Array.from(word).map((ch, ci) => (
                <span
                  key={ci}
                  data-af-char
                  aria-hidden="true"
                  className={cn(
                    "inline-block",
                    wi === 1 && "text-[#DAB24C]",
                  )}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimatedFooter;

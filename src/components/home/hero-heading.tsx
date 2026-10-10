"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export const heroApplications = [
  "Lưu Trữ Web",
  "Hạ Tầng Self-Host",
  "Triển Khai Ứng Dụng",
  "Ảo Hóa Máy Chủ",
];

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
function getPageVisible() {
  return document.visibilityState === "visible";
}
function serverSnapshot() {
  return true;
}

export function HeroHeading() {
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(0);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    serverSnapshot,
  );
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    getPageVisible,
    serverSnapshot,
  );
  const running = !reducedMotion && visible && pageVisible;
  const activeIndex = tick % heroApplications.length;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let disposed = false;
    const fitHeading = () => {
      if (disposed) return;
      const measurements = element.querySelectorAll<HTMLElement>(
        ".hero-heading-measure .hero-heading-row",
      );
      const widest = Math.max(
        ...Array.from(measurements, (row) => row.getBoundingClientRect().width),
      );
      const maximum = parseFloat(
        getComputedStyle(element).getPropertyValue("--hero-heading-max-size"),
      );
      if (!widest || !maximum) return;
      // Measure every phrase with the real font, keeping the same size through
      // a full rotation. The visible application retains its intrinsic width.
      const size = Math.min(
        maximum,
        ((element.clientWidth - 2) / widest) * maximum,
      );
      element.style.setProperty("--hero-heading-size", `${size}px`);
      const viewport = element.querySelector<HTMLElement>(".hero-applications");
      const active = element.querySelector<HTMLElement>(
        ".hero-application[data-active]",
      );
      if (!viewport || !active) return;
      // A font/viewport resize settles the current word before recalculating.
      viewport
        .getAnimations({ subtree: true })
        .forEach((animation) => animation.cancel());
      viewport
        .querySelectorAll<HTMLElement>("[data-outgoing]")
        .forEach((word) => delete word.dataset.outgoing);
      viewport.style.width = `${active.getBoundingClientRect().width}px`;
    };
    const observer = new ResizeObserver(fitHeading);
    observer.observe(element);
    document.fonts.ready.then(fitHeading);
    document.fonts.addEventListener("loadingdone", fitHeading);
    return () => {
      disposed = true;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fitHeading);
    };
  }, []);

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    const viewport = element.querySelector<HTMLElement>(".hero-applications");
    const words = element.querySelectorAll<HTMLElement>(".hero-application");
    const incoming = words[activeIndex];
    const outgoing = words[previousIndex.current];
    if (!viewport || !incoming || !outgoing) return;
    previousIndex.current = activeIndex;
    const fromWidth = viewport.getBoundingClientRect().width;
    const toWidth = incoming.getBoundingClientRect().width;
    viewport.style.width = `${toWidth}px`;
    if (reducedMotion || incoming === outgoing) return;

    outgoing.dataset.outgoing = "true";
    const timing: KeyframeAnimationOptions = {
      duration: 700,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "both",
    };
    // Update width and both vertical positions in the same pre-paint phase.
    // The white prefix/suffix stay mounted and fully opaque throughout.
    const animations = [
      viewport.animate(
        [{ width: `${fromWidth}px` }, { width: `${toWidth}px` }],
        timing,
      ),
      outgoing.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(calc(-100% - 2 * var(--hero-word-bleed)))" },
        ],
        timing,
      ),
      incoming.animate(
        [
          { transform: "translateY(calc(100% + 2 * var(--hero-word-bleed)))" },
          { transform: "translateY(0)" },
        ],
        timing,
      ),
    ];
    const settle = () => {
      delete outgoing.dataset.outgoing;
      animations.forEach((animation) => animation.cancel());
    };
    Promise.all(animations.map((animation) => animation.finished)).then(
      settle,
      () => {},
    );
    return settle;
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 3200);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div className="hero-heading" ref={container} data-running={running}>
      <h1
        id="hero-title"
        aria-label={`Giải Pháp ${heroApplications.join(", ")} Vượt Trội`}
      >
        <span className="hero-heading-row" aria-hidden="true">
          <span className="hero-heading-prefix">Giải Pháp</span>
          <span className="hero-applications">
            {heroApplications.map((application, index) => (
              <span
                key={application}
                className="hero-application"
                data-active={index === activeIndex || undefined}
              >
                {application}
              </span>
            ))}
          </span>
          <span className="hero-heading-suffix">Vượt Trội</span>
        </span>
      </h1>
      <div className="hero-heading-measure" aria-hidden="true">
        {heroApplications.map((application) => (
          <span className="hero-heading-row" key={application}>
            <span>Giải Pháp</span>
            <span>{application}</span>
            <span>Vượt Trội</span>
          </span>
        ))}
      </div>
    </div>
  );
}

import { useId } from "react";
import styles from "./capacity-network-map.module.css";

// Stylized geography and illustrative connections, not facility locations.
const land = [
  // North America, Greenland, South America.
  "M105 105 128 86 160 82 177 67 209 73 229 62 260 72 284 68 306 91 298 110 272 121 259 139 245 142 239 160 220 174 209 195 215 211 236 225 246 244 264 250 277 268 266 276 247 263 230 259 215 241 199 235 183 210 174 187 149 181 136 159 117 147 111 126 91 119Z",
  "M298 53 327 39 358 44 367 64 353 93 331 110 315 94 311 73Z",
  "M273 277 296 271 317 286 344 296 359 319 352 342 335 354 331 379 315 395 304 421 288 442 279 425 281 401 269 377 267 348 254 326 256 301Z",
  // Europe and Africa.
  "M470 131 479 116 489 113 492 92 508 77 520 82 513 111 525 124 541 122 550 138 538 152 515 154 507 169 490 168 481 154 465 153Z",
  "M462 181 483 170 512 176 531 173 549 193 558 219 577 232 564 253 549 261 543 292 525 318 508 332 495 317 486 292 471 271 466 246 447 225 448 203Z",
  "M558 298 568 291 572 308 565 328 557 321Z",
  // Asia, the island chains, Australia and New Zealand.
  "M533 112 550 94 579 91 595 74 625 80 650 64 680 69 702 60 731 73 760 69 784 81 819 79 846 92 875 101 897 121 878 139 853 135 833 151 811 149 797 174 771 184 753 205 728 201 717 222 700 238 683 227 674 204 655 205 640 225 631 244 617 231 608 205 589 194 582 173 562 164 547 148Z",
  "M557 192 579 194 599 214 591 235 571 226Z",
  "M701 239 710 253 726 263 734 281 724 286 710 271 697 260Z",
  "M745 292 764 298 783 297 798 307 786 315 764 310 748 311Z",
  "M760 245 774 257 777 278 765 272Z",
  "M825 178 832 168 835 184 825 200 818 198Z",
  "M794 338 814 326 834 330 850 320 863 341 880 355 877 381 861 393 837 387 821 393 801 379 785 359Z",
  "M911 387 919 375 924 386 914 401 905 411 900 407Z",
  // Small islands add detail without borders or labels.
  "M460 124 466 117 470 128 466 140 459 136Z",
  "M435 83 448 79 455 87 446 93 436 90Z",
  "M741 269 748 274 746 283 739 279Z",
].join(" ");

const nodes = [
  { x: 169, y: 177 },
  { x: 247, y: 159 },
  { x: 300, y: 310 },
  { x: 496, y: 148 },
  { x: 527, y: 249 },
  { x: 632, y: 206 },
  { x: 728, y: 232 },
  { x: 751, y: 278 },
  { x: 822, y: 187 },
  { x: 850, y: 360 },
];

const routes = [
  "M169 177 Q205 116 247 159",
  "M169 177 Q344 1 496 148",
  "M247 159 Q383 49 496 148",
  "M247 159 Q308 208 300 310",
  "M300 310 Q395 204 527 249",
  "M496 148 Q529 173 527 249",
  "M496 148 Q574 102 632 206",
  "M496 148 Q640 46 728 232",
  "M632 206 Q695 174 728 232",
  "M728 232 Q741 247 751 278",
  "M728 232 Q771 135 822 187",
  "M751 278 Q828 265 850 360",
  "M822 187 Q908 252 850 360",
];

export function CapacityNetworkMap() {
  const id = useId().replaceAll(":", "");
  const dots = `${id}-dots`;
  const geography = `${id}-land`;
  const glow = `${id}-glow`;
  const relief = `${id}-relief`;

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.ambient} />
      <div className={styles.plane}>
        <svg
          className={styles.map}
          viewBox="60 15 900 450"
          fill="none"
          focusable="false"
        >
          <defs>
            <pattern
              id={dots}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2.5" cy="2.5" r="1.05" fill="currentColor" />
            </pattern>
            <path id={geography} d={land} />
            <filter id={glow} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id={relief} x="-10%" y="-10%" width="120%" height="130%">
              <feGaussianBlur stdDeviation="1.4" />
            </filter>
          </defs>

          <g className={styles.grid} stroke="currentColor" strokeWidth="0.5">
            {[125, 200, 275, 350, 425].map((y) => (
              <path key={y} d={`M75 ${y} Q500 ${y + 42} 935 ${y}`} />
            ))}
            {[140, 280, 420, 560, 700, 840].map((x) => (
              <path
                key={x}
                d={`M${x} 45 Q${500 + (x - 500) * 1.15} 245 ${x} 445`}
              />
            ))}
          </g>

          <use
            href={`#${geography}`}
            className={styles.shadow}
            fill="currentColor"
            transform="translate(0 10)"
            filter={`url(#${relief})`}
          />
          <use
            href={`#${geography}`}
            className={styles.edge}
            fill={`url(#${dots})`}
            transform="translate(0 3)"
          />
          <use
            href={`#${geography}`}
            className={styles.land}
            fill={`url(#${dots})`}
          />

          <g className={styles.routes} stroke="currentColor" strokeWidth="0.9">
            {routes.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g className={styles.signals} stroke="currentColor" strokeWidth="1.6">
            {routes
              .filter((_, i) => i % 3 === 0)
              .map((d) => (
                <path key={d} d={d} pathLength="100" />
              ))}
          </g>

          {nodes.map(({ x, y }, i) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <circle
                r="10"
                fill="currentColor"
                opacity=".3"
                filter={`url(#${glow})`}
              />
              <circle
                className={styles.halo}
                r="7"
                stroke="currentColor"
                strokeWidth="0.7"
                style={{ animationDelay: `${i * -0.6}s` }}
              />
              <circle r="3.5" fill="var(--surface-canvas)" />
              <circle r="2" fill="currentColor" />
              <circle r=".75" fill="var(--surface-canvas)" />
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.veil} />
    </div>
  );
}

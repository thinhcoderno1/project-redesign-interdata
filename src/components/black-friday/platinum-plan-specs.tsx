import { useId } from "react";
import {
  ArrowDownUp,
  Cpu,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
  ShieldCheck,
} from "lucide-react";
import type { BlackFridayProduct } from "@/lib/black-friday-pricing";
import styles from "./platinum-plan-specs.module.css";

const planResources = [
  { key: "cpu", unit: "vCore", icon: Cpu },
  { key: "ram", unit: "GB RAM", icon: MemoryStick },
  { key: "nvme", unit: "GB SSD NVMe", icon: HardDrive },
] as const;

const vipFlamePath =
  "M7.3 19.3C3.4 19.3 1 17 1 13.8c0-2.2 1.1-4.1 2.7-5.8-.2 1.5.4 2.7 1.6 3.2C4.9 7.3 8.1 5.1 7.6 1c3.4 1.4 5.5 4.2 5 7 1.3-.5 2.4-1.6 2.6-2.9 1.2 1 1.7 1.7 1.8 2.6h11.8c3.7 0 6.2 2.4 6.2 5.6s-2.5 6-6.2 6Z";

function VipBadge() {
  const gradientId = useId();

  return (
    <svg
      className={styles.vipBadge}
      data-plan-vip
      viewBox="0 0 36 26"
      role="img"
      aria-label="VIP"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="1"
          x2="27"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="18%" stopColor="#e62a32" />
          <stop offset="43%" stopColor="#ff7a18" />
          <stop offset="68%" stopColor="#ffd45a" />
        </linearGradient>
      </defs>
      <g transform="scale(1 1.27)">
        <path
          d={vipFlamePath}
          fill={`url(#${gradientId})`}
          stroke="#ae3d14"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <path
          d="M8 17.3c-2.5-.2-3.9-2-3.4-4.2.5.9 1.1 1.4 1.9 1.5-.3-2.1 1.3-4.2 2-5.9 1.5 2.5 2.2 5.9-.5 8.6Z"
          fill="#ffe98a"
          opacity="0.85"
        />
        <path
          className={styles.vipRim}
          d={vipFlamePath}
          fill="none"
          stroke="#fff3be"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
      <text
        x="21"
        y="20.9"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="0.35"
        fill="#551800"
      >
        VIP
      </text>
    </svg>
  );
}

export function PlatinumPlanSpecs({
  product,
  className = styles.specs,
}: {
  product: BlackFridayProduct;
  className?: string;
}) {
  const { resources } = product;
  const networkSpecs = [
    { key: "ipv4", icon: Globe2 },
    { key: "port", icon: Network },
    { key: "bandwidth", icon: ArrowDownUp },
  ] as const;

  return (
    <ul className={className} aria-label="Cấu hình" role="list">
      {resources &&
        planResources.map(({ key, unit, icon: Icon }) => (
          <li key={key} data-plan-spec={key}>
            <Icon size={17} aria-hidden="true" />
            <span>
              {resources[key]} {unit}
            </span>
          </li>
        ))}
      {networkSpecs.map(
        ({ key, icon: Icon }) =>
          product[key] && (
            <li key={key} data-plan-spec={key}>
              <Icon size={17} aria-hidden="true" />
              <span>{product[key]}</span>
            </li>
          ),
      )}
      {product.firewall && (
        <li className={styles.firewallSpec} data-plan-spec="firewall">
          <ShieldCheck size={17} aria-hidden="true" />
          <span className={styles.firewallLabel}>
            <span>{product.firewall}</span>
            <VipBadge />
          </span>
        </li>
      )}
    </ul>
  );
}

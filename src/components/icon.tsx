import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gift,
  Globe2,
  HardDrive,
  Headphones,
  Home,
  Layers3,
  Menu,
  Network,
  ShieldCheck,
  Ticket,
  X,
  type LucideIcon,
} from "lucide-react";
const icons: Record<string, LucideIcon> = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  boxes: Boxes,
  building: Building2,
  check: Check,
  down: ChevronDown,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  database: Database,
  gift: Gift,
  globe: Globe2,
  harddrive: HardDrive,
  headphones: Headphones,
  home: Home,
  layers: Layers3,
  menu: Menu,
  network: Network,
  shield: ShieldCheck,
  ticket: Ticket,
  close: X,
  server: Database,
};
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Component = icons[name] || Database;
  return (
    <Component
      size={22}
      strokeWidth={1.6}
      aria-hidden="true"
      className={className}
    />
  );
}

"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type HomeSectionLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  section: string;
};

export function HomeSectionLink({ section, ...props }: HomeSectionLinkProps) {
  const pathname = usePathname();
  return <a {...props} href={`${pathname === "/" ? "" : "/"}#${section}`} />;
}

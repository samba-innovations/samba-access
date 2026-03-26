"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function NavLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before mount, render nothing to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-8 w-[180px]" />;
  }

  const src =
    resolvedTheme === "dark"
      ? "/imgs/innvtns-logotipo2.svg"
      : "/imgs/innvtns-logotipo.svg";

  return (
    <Image
      src={src}
      alt="Samba Innovations"
      width={180}
      height={28}
      className="h-8 w-auto"
      priority
    />
  );
}

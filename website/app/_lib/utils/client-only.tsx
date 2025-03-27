"use client";
import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if(typeof window === "undefined") return null
  return <>{children}</>;
}
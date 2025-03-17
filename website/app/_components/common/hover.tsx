"use client";

import { ReactElement } from "react";
import { useHover } from "react-use";

interface HoverableProps {
  children: (isHover: boolean) => ReactElement;
}

export function Hoverable({ children }: HoverableProps) {
  const [newElement] = useHover(children as any); // @todo Jaxtyn
  return newElement;
}

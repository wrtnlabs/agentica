"use client";

import { useHover } from "react-use";

import type React from "react";

interface HoverableProps {
  children: (isHover: boolean) => React.ReactElement;
}

export function Hoverable({ children }: HoverableProps) {
  const [newElement] = useHover(children);
  return newElement;
}

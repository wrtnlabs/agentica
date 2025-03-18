"use client";

import React from "react";
import { useHover } from "react-use";

interface HoverableProps {
  children: (isHover: boolean) => React.ReactElement;
}

export function Hoverable({ children }: HoverableProps) {
  const [newElement] = useHover(children);
  return newElement;
}

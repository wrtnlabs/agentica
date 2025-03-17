"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/app/_lib/utils/cn";
import { motion } from "framer-motion";
import { useAttributeObserver } from "@/app/_hooks/useAttributeObserver";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("relative flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground inline-flex h-[58px] w-full items-center justify-center gap-8 rounded-full bg-zinc-900 p-3",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const [ref, attribute] =
    useAttributeObserver<HTMLButtonElement>("data-state");
  const isActive = attribute === "active";

  return (
    <TabsPrimitive.Trigger
      asChild
      data-slot="tabs-trigger"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring relative z-20 inline-flex h-[34px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-4 text-sm font-medium whitespace-nowrap text-slate-50 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-slate-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        !isActive && "transition-all duration-300 hover:bg-zinc-800",
        className,
      )}
      ref={ref}
      {...props}
    >
      <motion.li initial={false}>
        {children}
        {isActive && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute right-0 bottom-0 left-0 -z-10 h-full rounded-full bg-zinc-50 shadow-sm"
            initial={false}
            transition={{ type: "spring", duration: 0.6 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.li>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

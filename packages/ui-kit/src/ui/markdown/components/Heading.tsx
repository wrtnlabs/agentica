import React from "react";

export const Heading = {
  h1: ({ ...props }) => (
    <h1 {...props} className="text-3xl text-zinc-800 pt-12 pb-6" />
  ),
  h2: ({ ...props }) => (
    <h2 {...props} className="text-2xl text-zinc-800 pt-10 pb-6" />
  ),
  h3: ({ ...props }) => (
    <h3 {...props} className="text-xl text-zinc-800 pt-8 pb-6" />
  ),
  h4: ({ ...props }) => (
    <h4 {...props} className="text-base text-zinc-800 pt-7 pb-5" />
  ),
  h5: ({ ...props }) => (
    <h5 {...props} className="text-sm text-zinc-800 pt-6 pb-4" />
  ),
  h6: ({ ...props }) => (
    <h6 {...props} className="text-xs text-zinc-800 pt-5 pb-4" />
  ),
};

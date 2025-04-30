import React from "react";

export const List = {
  ul: ({ ...props }) => (
    <ul {...props} className="text-base text-zinc-800 list-disc list-inside" />
  ),
  ol: ({ ...props }) => (
    <ol {...props} className="text-base text-zinc-800 list-decimal list-inside" />
  ),
  li: ({ ...props }) => (
    <li {...props} className="text-base text-zinc-800" />
  ),
};

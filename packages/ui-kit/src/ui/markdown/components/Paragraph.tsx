import React from "react";

export const Paragraph = {
  p: ({ ...props }) => (
    <p {...props} className="text-base text-zinc-800" />
  ),
  strong: ({ ...props }) => (
    <strong {...props} className="text-base text-zinc-800" />
  ),
  em: ({ ...props }) => (
    <em {...props} className="text-base text-zinc-800" />
  ),
};

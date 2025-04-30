import React from "react";

export const Link = {
  a: ({ ...props }) => (
    <a {...props} target="_blank" rel="noopener" className="text-base text-blue-400 hover:underline" />
  ),
};

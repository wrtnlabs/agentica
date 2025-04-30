import React from "react";

export const Quote = {
  blockquote: ({ ...props }) => (
    <blockquote {...props} className="border-l-4 border-zinc-200 pl-3 text-base text-zinc-800 my-5" />
  ),
};

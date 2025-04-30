import React from "react";

export const Image = {
  img: ({ ...props }) => (
    <img
      {...props}
      className="w-full h-auto max-w-[480px] object-cover object-center"
    />
  ),
};

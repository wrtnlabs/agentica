import React from "react";

export const Table = {
  table: ({ ...props }) => (
    <table {...props} className="table-auto py-8" />
  ),
  thead: ({ ...props }) => (
    <thead {...props} className="" />
  ),
  tbody: ({ ...props }) => (
    <tbody {...props} className="" />
  ),
  tr: ({ ...props }) => (
    <tr {...props} className="text-left border-b border-zinc-100" />
  ),
  th: ({ ...props }) => (
    <th {...props} className="py-4" />
  ),
  td: ({ ...props }) => (
    <td {...props} className="py-4" />
  ),
};

import React from "react";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-5xl font-bold text-warn mb-2">404</h1>
      <div className="text-info text-lg">Page not found.</div>
    </div>
  );
}


import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b flex items-center justify-between px-4 py-3 bg-background shadow">
      <div className="flex items-center gap-4">
        <a href="/" className="font-semibold text-lg tracking-tight text-primary">Fakebuster</a>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </nav>
  );
}

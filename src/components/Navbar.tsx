import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { OpenAIApiKeyDialog } from "./OpenAIApiKeyDialog";
import { Button } from "./ui/button";

export function Navbar() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <nav className="border-b flex items-center justify-between px-4 py-3 bg-background shadow">
      <div className="flex items-center gap-4">
        <a href="/" className="font-semibold text-lg tracking-tight text-primary">Fakebuster</a>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          Set OpenAI API Key
        </Button>
        <OpenAIApiKeyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </nav>
  );
}

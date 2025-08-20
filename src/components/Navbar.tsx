
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export function Navbar() {
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("❌ Sign-out error:", error);
    }
  };

  return (
    <nav className="border-b flex items-center justify-between px-4 py-3 bg-background shadow">
      <div className="flex items-center gap-4">
        <a href="/" className="font-semibold text-lg tracking-tight text-primary">Fakebuster</a>
      </div>
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.displayName || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}

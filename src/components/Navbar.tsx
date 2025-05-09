
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b py-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="FakeBuster Logo" className="h-8 w-8" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Fakebuster
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Fact Checker
            </Link>
            <Link
              to="/history"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              History
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

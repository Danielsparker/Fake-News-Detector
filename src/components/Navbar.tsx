import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"; // adjust path if needed

export function Navbar() {
  const [user] = useAuthState(auth);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

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

          {!user ? (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <img
                src={user.photoURL ?? ""}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

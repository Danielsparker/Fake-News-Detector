
import { useEffect, useState, ReactNode } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from "./components/Navbar"; // Import Navbar for the direct display

type Props = {
  children: ReactNode;
};

export default function AuthWrapper({ children }: Props) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 Firebase User:", user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign in
  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="bg-card rounded-2xl p-8 shadow-2xl max-w-md w-full text-center backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome to FakeBuster 🔍</h1>
            <p className="text-sm mb-8 text-muted-foreground">
              Sign in to access the AI truth filter
            </p>
            <button
              onClick={async () => {
                try {
                  const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
                  const provider = new GoogleAuthProvider();
                  await signInWithPopup(auth, provider);
                } catch (error) {
                  console.error("❌ Sign-in error:", error);
                }
              }}
              className="flex items-center justify-center gap-3 w-full bg-background border border-border rounded-full px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the app
  return <>{children}</>;
}

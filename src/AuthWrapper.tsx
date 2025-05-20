
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

  if (loading) return <p>Loading...</p>;

  // Always show the content now, regardless of user status
  return <>{children}</>;
}

import { useEffect, useState, ReactNode } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./login";

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

  return user ? <>{children}</> : <Login />;
}

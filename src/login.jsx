import { auth, provider } from './firebase';
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Logged in user:", user);
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  return (
    <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
}



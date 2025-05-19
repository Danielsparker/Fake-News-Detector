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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to FakeBuster 🔍</h1>

      <button
        onClick={handleLogin}
        className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

console.log("🔁 Login component loaded");

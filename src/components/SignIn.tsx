// src/components/SignIn.tsx
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import "../styles/gradient.css"; //

const SignIn: React.FC = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Logged in as:", user.displayName);
    } catch (error) {
      console.error("❌ Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient text-white">
      <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-md w-full text-center text-black backdrop-blur-sm bg-opacity-80">
        <h1 className="text-3xl font-bold mb-6">Welcome Back 👋</h1>
        <p className="text-sm mb-8 text-gray-600">
          Sign in to access your dashboard
        </p>
        <button
          onClick={handleSignIn}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-full px-6 py-3 text-sm font-semibold text-gray-700 hover:shadow-lg transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;

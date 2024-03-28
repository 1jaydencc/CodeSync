// @/app/page
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase-config";
import {
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { useEffect } from "react";

import "@/app/login.css";
import "@/app/globals.css";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();

  const handleGitHubLogin = async () => {
    const provider = new GithubAuthProvider();
    console.log("GitHub login");
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a GitHub Access Token.
      const token = result.credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      console.log(user);
      router.push("/editor"); // Redirect the user after successful login
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect them to the editor
        console.log("User is signed in");
        router.push("/editor");
      } else {
        // User is signed out, stay on this page or handle accordingly
        console.log("User is not signed in");
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="wrapper">
      <div>
        <button onClick={handleGitHubLogin}>Login with GitHub</button>
      </div>
      {showNotification && (
        <div className="notification-overlay">
          <div className="notification">
            <p>{error}</p>
            <button onClick={() => setShowNotification(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

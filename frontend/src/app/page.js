// @/app/page
"use client";

import TitleBar from "./title-bar/title-bar.js";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase-config";
import {
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { useEffect } from "react";

//import "@/app/login.css";
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

      // The signed-in user info.
      const user = result.user;

      console.log(user);
      router.push("/editor"); // Redirect the user after successful login
    } catch (error) {
      console.error(error);
      let errorMessage =
        error.message || "An unexpected error occurred. Please try again.";

      errorMessage = errorMessage
        .replace("Firebase: ", "")
        .replace("(auth/", "")
        .replace(").", "");

      setError(errorMessage);
      setShowNotification(true);
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
    <div
      data-theme="dark"
      className="bg-base-200 flex min-h-screen flex-col items-center justify-center"
    >
      <TitleBar />
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Login Required</h2>
          <p>Please log in with your GitHub account to continue.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-neutral" onClick={handleGitHubLogin}>
              Login with GitHub
            </button>
          </div>
        </div>
      </div>
      {showNotification && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <span>{error}</span>
            </div>
            <div className="flex-none">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowNotification(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

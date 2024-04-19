'use client';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import './redirection.css';
import { useRouter, useLocation } from 'next/navigation';
import { auth } from '@/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function HandleEmailAction() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');

    const handleEmailVerification = async () => {
      setLoading(true);
      try {
        // Your email verification logic here
      } catch (error) {
        console.error('Error verifying email:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    const handlePasswordReset = async () => {
      setLoading(true);
      try {
        // Your password reset logic here
      } catch (error) {
        console.error('Error sending password reset email:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    // Determine the action based on the mode query parameter
    if (mode === 'verifyEmail') {
      handleEmailVerification();
    } else if (mode === 'resetPassword') {
      handlePasswordReset();
    }
  }, [location.search]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {/* You can render additional loading state or UI here */}
    </div>
  );
}

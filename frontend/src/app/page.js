// @/app/page
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { useEffect } from 'react';

import '@/app/login.css';
import '@/app/globals.css';

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect them to the editor
        console.log('User is signed in');
        router.push('/editor');
      } else {
        // User is signed out, stay on this page or handle accordingly
        console.log('User is not signed in');
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [router]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setFormData({ email: '', password: '' });
        setError('Please verify your email.');
        setShowNotification(true);
      }
      else {
        router.push('/editor');
      }
      console.log(userCredential.user);
    } catch (error) {
      setFormData({ email: '', password: '' });
      setError(getErrorMessage(error.code));
      setShowNotification(true);
    }
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-credential': 'No account found.',
      'auth/too-many-requests': 'Too many requests, try again in a bit.' 
    };

    return errorMessages[errorCode] || errorCode;
  };

  return (
    <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className='input-box'>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='input-box'>
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type='submit'>Login</button>

            <div className='forgot-password'>
                <a href="/password-reset">Forgot Password?</a>
            </div>
            <div className='divider'>
                <p>___________________________</p>
            </div>
            <div className='register-link'>
                <p><a href="/register">Create Account</a></p>
            </div>
        </form>
        <div>
          {showNotification && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>{error}</p>
              <button onClick={() => setShowNotification(false)}>Try Again</button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

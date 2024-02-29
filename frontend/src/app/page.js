'use client';

import React, { useState } from 'react';
import { auth } from '@/firebase-config.js';
import { signInWithEmailAndPassword } from "firebase/auth";

import './LoginForm.css';
import './globals.css';

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
      alert('Login successful');
      console.log(userCredential.user);
      // Redirect user to another page or perform any necessary action
    } catch (error) {
      alert(error.message);
    }
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
                <a href="/Password-Reset">Forgot Password?</a>
            </div>
            <div className='divider'>
                <p>___________________________</p>
            </div>
            <div className='register-link'>
                <p><a href="/Register">Create Account</a></p>
            </div>

        </form>
    </div>
  );
}

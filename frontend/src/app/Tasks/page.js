'use client';
import '@/app/globals.css'
import '@/app/Tasks/Tasks.css'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { db, auth } from '@/firebase-config'

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    task_name: '',
    task_description: '',
    task_author: '',
    task_created: '',
    task_due: '',
    error_msg: ''
  });

  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showError, setshowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { task_name, task_description, task_author, task_created, task_due, error_msg } = formData;
        try { // Create task in Firebase
        } catch (error) {   // set error message
            console.error("Error creating task:", error.message);
            // Set error state and clear form fields
            setFormData({ errro_msg: "Error creating task" });
            setError(getErrorMessage(error.code));
            setshowError(true);
        }
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Email address is already in use.',
      'auth/weak-password': 'Password must be longer than 6 characters.',
      'auth/invalid-email': 'Please input a valid email.'
    };

    return errorMessages[errorCode] || errorCode;
  };


  return (
    <div>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <h1>Add a Task</h1>
            <div className='input-box'>
            <input
              type='task name'
              name='task name'
              placeholder='Task Nmae'
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

            <button type='submit'>CREATE</button>

            <div className='terms'>
                <p>By continuing, you agree to CodeSync&apos;s Terms of Service and Privacy Policy</p>
            </div>
        </form>
        <div>
          {showNotification && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>Verification email sent!</p>
              <button onClick={() => {
                setShowNotification(false);
                router.push('/');
            }}>Go to Login.</button>
              </div>
            </div>
          )}
        </div>
        <div>
          {showError && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>{error}</p>
              <button onClick={() => setshowError(false)}>Try Again.</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import '@/app/globals.css'
import '@/app/password-reset/password-reset.css'
import { useRouter } from 'next/navigation';

export default function Home() {

  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowNotification(true);
    console.log('Form Submitted.');
  };

  const router = useRouter();

  const handleGoToHomePage = () => {
    router.push('/continue-reset'); // Use navigate function to go to the home page
  };

  return (
    <div>
      <div className='wrapper'>
        <form action='' onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <div className='reset-information'>
                <p>Enter your new Password.</p>
            </div>
            <div className='input-box'>
                <input type='text' placeholder='Password' required/>
            </div>
            <button type='submit'>Reset</button>
        </form>
      </div>
      <div>
          {showNotification && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>Password Reset!</p>
              <button onClick={() => setShowNotification(false)}>Close</button>
              <button onClick={handleSubmit}>Resend</button>
              <button onClick={handleGoToHomePage}>Reset</button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
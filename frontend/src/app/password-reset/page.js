'use client';
import { useState } from 'react';
import '@/app/globals.css'
import '../password-reset.css'
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase-config'
import { sendPasswordResetEmail } from 'firebase/auth'


export default function Home() {

  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;
    try {
      await sendPasswordResetEmail(auth, email);
      setFormData({email: ''});
      setShowNotification(true);
    } catch (error) {
      setFormData({ email: '' });
      setError(getErrorMessage(error.code));
      setShowError(true);
    }
  };

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoToHomePage = () => {
    router.push('/'); // Use navigate function to go to the home page
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Please input a valid email.'
    };

    return errorMessages[errorCode] || errorCode;
  };

  return (
    <div>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <h1>Forgot Your Password?</h1>
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
            <button type='submit'>Send Reset Link</button>
        </form>
        <div>
          {showNotification && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>Reset link sent successfully!</p>
              <button onClick={() => setShowNotification(false)}>Close</button>
              <button onClick={handleSubmit}>Resend</button>
              <button onClick={handleGoToHomePage}>Reset</button>
              </div>
            </div>
          )}
        </div>
        <div>
          {showError && (
            <div className='notification-overlay'>
              <div className='notification'>
              <p>{error}</p>
              <button onClick={() => setShowError(false)}>Try Again.</button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

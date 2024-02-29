'use client';
import '../globals.css'
import './Register.css'
import React, { useState } from 'react';


export default function Home() {
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: 'Hello',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('HELLO!');
    fetch('http://127.0.0.1:8000/auth/sign-up/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        console.log('Request sent to the backend:', response);
        if (response.ok) {
          alert('Sign-up successful');
          // Redirect user to another page or perform any necessary action
        } else {
          const data = await response.json();
          throw new Error(data.detail || 'Failed to sign up');
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };


  return (
    <div>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <h1>Create a Codesync Account</h1>
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
                <input type='text' placeholder='Username' required/>
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
            <div className='input-box'>
                <input type='text' placeholder='Confirm Password' required/>
            </div>

            <button type='submit'>CREATE</button>

            <div className='terms'>
                <p>By continuing, you agree to CodeSync's Terms of Service and Privacy Policy</p>
            </div>
        </form>
      </div>
    </div>
  );
}
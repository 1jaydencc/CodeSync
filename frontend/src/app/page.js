import './LoginForm.css'
import './globals.css'

export default function Home() {
  return (
    <div>
      <div className='wrapper'>
        <form action=''>
            <h1>Login</h1>
            <div className='input-box'>
                <input type='text' placeholder='Email' required/>
            </div>
            <div className='input-box'>
                <input type='text' placeholder='Password' required/>
            </div>
            <button type='submit'>Login</button>

            <div className='forgot-password'>
                <a href="Forgot Password?">Forgot Password?</a>
            </div>
            <div className='divider'>
                <p>___________________________</p>
            </div>
            
            <div className='register-link'>
                <p><a href="/Register">Create Account</a></p>
            </div>

        </form>
    </div>
    </div>
  );
}
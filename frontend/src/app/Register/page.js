import '../globals.css'
import './Register.css'

export default function Home() {
  return (
    <div>
      <div className='wrapper'>
        <form action=''>
            <h1>Create a Codesync Account</h1>
            <div className='input-box'>
                <input type='text' placeholder='Email' required/>
            </div>
            <div className='input-box'>
                <input type='text' placeholder='Username' required/>
            </div>
            <div className='input-box'>
                <input type='text' placeholder='Password' required/>
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
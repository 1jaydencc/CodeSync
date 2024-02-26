import './LoginForm.css'
import './globals.css'

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('HELLO!');
    fetch('http://127.0.0.1:8000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (response.ok) {
          alert('login successful');
          // Redirect user to another page or perform any necessary action
        } else {
          const data = await response.json();
          throw new Error(data.detail || 'Failed to login');
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };



  return (
    <div>
      <div className='wrapper'>
        <form action=''>
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
    </div>
  );
}
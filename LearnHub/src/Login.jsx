import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './assets/logo.svg';
import { useAuth } from '../controller/authController';


function Login() {
  const navigate = useNavigate();
  const { login} = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const email = form.get('email');
  const password = form.get('password');

  try {
    const adminRes = await axios.post('http://localhost:8001/login/admin', { email, password });
    alert(`Welcome Admin ${adminRes.data.admin.username}`);
    login(adminRes.data.admin);
    navigate('/');
    return;
  } catch (adminErr) {
    if (adminErr.response?.status === 404) {
      try {
        const userRes = await axios.post('http://localhost:8001/login/user', { email, password });
        alert(`Welcome ${userRes.data.user.username}`);
        login(userRes.data.user);
        navigate('/');
        return;
      } catch (userErr) {
        console.error('User login error:', userErr);
        alert(userErr.response?.data?.message || 'User login failed');
      }
    } else {
      console.error('Admin login error:', adminErr);
      alert(adminErr.response?.data?.message || 'Admin login failed');
    }
  }
};


  return (
    <div className="d-flex flex-column justify-content-between w-100" style={{ minHeight: '100vh', background: 'linear-gradient(to right, #2c3e50, #3498db)' }}>
      
      
      <div className="headtag d-flex align-items-center px-4 py-2">
        <img src={logo} alt="LearnHub Logo" style={{ width: '40px', marginRight: '10px' }} />
        <h2 className="text-white m-0 fw-bold">LearnHub</h2>
        <div className='d-flex ms-auto'>
          <button className='m-4 btn btn-danger' style={{ width: "70px" }} onClick={() => navigate('/')}>
            Back
          </button>
        </div>
      </div>

      
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card land p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email" // ✅ Fixed name
                id="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                autoFocus
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password" // ✅ Fixed name
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn button w-100 mb-3 bg-primary text-white fw-semibold">
              Login
            </button>
            <div className="text-muted mb-3 text-center">(or)</div>
            <button
              type="button"
              className="btn button w-100 bg-primary text-white fw-semibold"
              onClick={() => navigate('/SignUp')}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      
      <footer className="text-center text-white py-3" style={{ backgroundColor: '#2c3e50' }}>
        © 2025 LearnHub. All Rights Reserved.
      </footer>
    </div>
  );
  }

export default Login;

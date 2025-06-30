import React from 'react';
import logo from './assets/logo.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navi = useNavigate();

  const handleUser = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const username = form.get('username');
    const email = form.get('email');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      const response = await axios.post('http://localhost:8001/signup/user', {
        username,
        email,
        password
      });

      if (response.status === 201) {
        alert('Account created successfully!');
        navi('/Login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      alert(msg);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between w-100" style={{ minHeight: '100vh', background: 'linear-gradient(to right, #2c3e50, #3498db)' }}>
      <div className="headtag d-flex align-items-center px-4 py-2">
        <img src={logo} alt="LearnHub Logo" style={{ width: '40px', marginRight: '10px' }} />
        <h2 className="text-white m-0 fw-bold">LearnHub</h2>
        <div className='d-flex ms-auto'>
          <button className='m-4 btn btn-danger' style={{ width: "70px" }} onClick={() => navi('/Login')}>Back</button>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card land p-4 shadow" style={{ maxWidth: '420px', width: '100%' }}>
          <h2 className="fw-bold mb-4">Create Your Account</h2>

          <form onSubmit={handleUser}>
            <div className="mb-3 text-start">
              <label htmlFor="name" className="form-label">Full Name (As per your document)</label>
              <input type="text" className="form-control" name="username" id="name" placeholder="Enter your name" required />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" placeholder="Create a password" required />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold">Create Account</button>
          </form>

        </div>
      </div>

      <footer className="text-center text-white py-3" style={{ backgroundColor: '#2c3e50' }}>
        © 2025 LearnHub. All Rights Reserved.
      </footer>
    </div>
  );
}

export default SignUp;


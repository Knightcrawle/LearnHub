import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.svg';
import { useAuth } from '../controller/authController';
import axios from 'axios';

function MainPage() {
  const navigate = useNavigate();
  const { curUser, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [update, setUpdate] = useState(false);
  const [setChange] = useState(null);

  useEffect(() => {
    if (curUser?.email) {
      axios.get(`http://localhost:8001/User?email=${curUser.email}`)
        .then((res) => {
          if (res.data.length > 0) {
            setChange(res.data[0]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [curUser]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      setMenu(false);
      navigate('/');
    }
  };

  const handleChange = () => setUpdate(!update);

  const check = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const current = form.get('curpass');
    const newPass = form.get('newpass');

    try {
      const res = await axios.post('http://localhost:8001/User/update-password', {
        email: curUser.email,
        currentPassword: current,
        newPassword: newPass
      });

      alert(res.data.message || 'Password updated');
      setMenu(false);
      setUpdate(false);
      alert('Logged out. Please log in again.');
      logout();
    } catch (err) {
      console.error('Password update error:', err);
      alert(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="headtag d-flex align-items-center px-4 py-2 position-relative">
      <img src={logo} alt="LearnHub Logo" style={{ width: '40px', marginRight: '10px' }} />
      <h2 className="text-white m-0 fw-bold">LearnHub</h2>
      <div className="ms-auto position-relative">
        {curUser ? (
          <>
            <img
              src="src/assets/person-circle.svg"
              alt="profile"
              className="ms-3"
              style={{ width: '35px', height: '35px', cursor: 'pointer', objectFit: 'cover' }}
              onClick={() => setMenu(!menu)}
            />
            {menu && (
              <div className="position-absolute end-0 mt-2 p-3 bg-white rounded shadow" style={{ zIndex: 999, minWidth: '200px' }}>
                <p className="mb-1"><strong>Email:</strong> {curUser.email}</p>
                <button className='btn btn-secondary mb-3 w-100 mt-2' onClick={() => navigate('/profile', { state: { curUser } })}>Profile</button>
                <button className="btn btn-success mb-3 w-100 mt-2" onClick={handleChange}>Change Password</button>
                {update && (
                  <form onSubmit={check}>
                    <input type="password" name="curpass" placeholder="Current password" className="mb-1 w-100 mt-2" required />
                    <input type="password" name="newpass" placeholder="New password" className="mb-2 w-100 mt-2" required />
                    <button className="btn btn-secondary w-100 mt-3">Confirm</button>
                  </form>
                )}
                <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <button className="btn btn-secondary ms-3" onClick={() => navigate('/Login')}>
            LOGIN / SIGN UP
          </button>
        )}
      </div>
    </div>
  );
}

export default MainPage;

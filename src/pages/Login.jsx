import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    restaurantSlug: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('super'); // 'super' or 'restaurant'

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(
      formData.email, 
      formData.password, 
      loginType === 'restaurant' ? formData.restaurantSlug : null
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Restaurant SaaS Login</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="super"
            checked={loginType === 'super'}
            onChange={(e) => setLoginType(e.target.value)}
          />
          Super Admin
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="restaurant"
            checked={loginType === 'restaurant'}
            onChange={(e) => setLoginType(e.target.value)}
          />
          Restaurant User
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        {loginType === 'restaurant' && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="restaurantSlug"
              placeholder="Restaurant Slug"
              value={formData.restaurantSlug}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
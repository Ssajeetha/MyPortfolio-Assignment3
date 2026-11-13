import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../auth-helper';

function Signin() {
  const navigate = useNavigate();

  // State to store form input values
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  });

  // Handle typing inside any input field
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: '' });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();

      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // Save the JWT token and user info, then redirect home
        auth.authenticate(data, () => {
          navigate('/');
        });
      }
    } catch (err) {
      setValues({ ...values, error: 'Could not connect to the server.' });
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '0 20px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '36px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
          Sign In
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
          Sign in to your portfolio account
        </p>

        {/* Error Alert Box */}
        {values.error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {values.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              required
              placeholder="e.g. admin@portfolio.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>

        {/* Link to Signup */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>

        {/* Professor Hint Box */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#64748b'
        }}>
         
        </div>
      </div>
    </div>
  );
}

export default Signin;
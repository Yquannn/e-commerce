import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router for navigation
import '../styles/LogInUser.css'; // Create a separate CSS file for styling

const LogInUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Track loading state

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() && password.trim()) {
      setLoading(true);  // Start loading
      try {
        const response = await fetch('http://localhost:3001/api/accounts/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          // Save login status and user info to localStorage
          localStorage.setItem('userLoggedIn', true);
          localStorage.setItem('userEmail', email);
          alert('Login successful!');
          // Redirect to home or dashboard after successful login
          window.location.href = '/shop'; // Example redirect
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setError('An error occurred while logging in.');
      } finally {
        setLoading(false);  // Stop loading
      }
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="signup-link">
          <p>Doesn't have an account yet? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LogInUser;

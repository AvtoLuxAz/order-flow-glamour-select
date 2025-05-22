import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Assuming path to UserContext
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { toast } from 'react-hot-toast'; // For displaying notifications

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading, user, session } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in (e.g. session restored), redirect them
    if (user && session) {
      console.log('LoginPage: User already logged in, redirecting to /dashboard');
      toast.success(`Welcome back, ${user.email}!`);
      navigate('/dashboard'); // Or your desired redirect path
    }
  }, [user, session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    console.log(`LoginPage: Attempting login for user: ${email}`);
    await login(email, password);
    // Navigation upon successful login is now handled by the useEffect above,
    // or could be explicitly handled here if login function returns a success status.
    // Example:
    // const success = await login(email, password);
    // if (success) {
    //   navigate('/dashboard');
    // }
  };

  // Basic form styling (inline for simplicity, could be moved to CSS)
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box' as 'border-box',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      width: '100%',
      maxWidth: '400px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    input: {
      marginBottom: '15px',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    button: {
      padding: '10px 15px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    disabledButton: {
      padding: '10px 15px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#aaa',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed',
    }
  };
  
  // If UserContext is still loading the session, show a generic loading message
  if (isLoading && !user && !session) {
      return <div style={styles.container}><p>Loading session...</p></div>;
  }


  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" disabled={isLoading} style={isLoading ? styles.disabledButton : styles.button}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <a href="/signup">Sign Up</a> {/* Assuming a /signup route exists */}
      </p>
      <div style={{marginTop: '20px', padding: '10px', border: '1px solid lightgrey'}}>
        <p><strong>Manual Testing Steps for LoginPage:</strong></p>
        <ol>
          <li>Ensure `UserProvider` is wrapping this page and the rest of the app.</li>
          <li>Try logging in with a valid Supabase user's email and password.
              <ul>
                <li>Expected: Successful login, toast notification, console log, redirect to '/dashboard'. User object in UserContext should be populated with role.</li>
              </ul>
          </li>
          <li>Try logging in with invalid credentials.
              <ul>
                <li>Expected: Failed login, toast error message, console log. No redirect.</li>
              </ul>
          </li>
          <li>If already logged in and navigating to `/login`, it should redirect to `/dashboard`.</li>
          <li>The "Login" button should be disabled and show "Logging in..." during the login attempt.</li>
          <li>Check console for logs from `LoginPage` and `UserContext` for diagnostics.</li>
          <li>Verify that `useUser().login` is called, not any old `useAuth().login`.</li>
        </ol>
      </div>
    </div>
  );
};

export default LoginPage;
console.log('pages/LoginPage.tsx created and LoginPage component exported.');

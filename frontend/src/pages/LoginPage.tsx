import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoginContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--secondary-bg);
  border-radius: 10px;
`;

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await login(username, password);
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      } else {
        await register(username, password);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Create Account'}</h2>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
          </Button>
        </div>
      </Form>

      <div className="mt-3 text-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Create one' : 'Have an account? Login'}
        </Button>
      </div>
    </LoginContainer>
  );
};

export default LoginPage;
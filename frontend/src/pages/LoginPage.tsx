
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordStrengthMeter = ({ score }: { score: number }) => {
  const strengthLevels = ['', 'Very Weak', 'Weak', 'Medium', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2">
      <div 
        className={`h-2.5 rounded-full ${colors[score]}`}
        style={{ width: `${(score / 5) * 100}%`, transition: 'width 0.3s ease-in-out' }}
      ></div>
      <p className="text-xs text-right mt-1">{strengthLevels[score]}</p>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      checkPasswordStrength(newPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await register(email, password);
        // Auto-login after successful registration
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard', { state: { message: 'Account created successfully.' } });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">{isLogin ? 'Login' : 'Create Account'}</h2>
            {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                />
                <button 
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {!isLogin && <PasswordStrengthMeter score={passwordStrength} />}
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-lg font-medium mb-2">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-electric-blue text-white font-bold rounded-lg disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-electric-blue hover:underline">
                {isLogin ? 'Need an account? Create one' : 'Have an account? Login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;

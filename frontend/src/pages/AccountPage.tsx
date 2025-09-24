import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const changePassword = async (current_password: string, new_password: string) => {
    return axios.patch(`${API_URL}/users/me/password`, {
        current_password,
        new_password
    }, {
        headers: getAuthHeaders()
    });
};

const deleteAccount = async () => {
    return axios.delete(`${API_URL}/users/me`, {
        headers: getAuthHeaders()
    });
};

const AccountPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const response = await changePassword(currentPassword, newPassword);
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while changing password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while deleting the account.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-8">Manage Account</h2>
      
      {message && <div className="bg-green-500 text-white p-4 rounded-lg mb-6">{message}</div>}
      {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-6">{error}</div>}

      <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-bold mb-6">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-lg font-medium mb-2">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
          <button type="submit" className="py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">Change Password</button>
        </form>
      </div>

      <div className="p-8 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-200">Delete Account</h3>
        <p className="mb-4">This action is irreversible. All your data, including your generated notes, will be permanently deleted.</p>
        <button onClick={handleDeleteAccount} className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg">Delete My Account</button>
      </div>
    </div>
  );
};

export default AccountPage;
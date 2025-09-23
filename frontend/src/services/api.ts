import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadFile = async (file: File, noteStyle: string, guestId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('note_style', noteStyle);

  const response = await axios.post(`${API_URL}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'guest-id': guestId
    },
  });
  return response.data;
};

export const getNoteResult = async (contentId: number) => {
  const response = await axios.get(`${API_URL}/api/results/${contentId}`);
  return response.data;
};

export const downloadNote = async (contentId: number) => {
  const response = await axios.get(`${API_URL}/download/${contentId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData);
    return response.data;
};

export const register = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/users/`, { username, password });
    return response.data;
};

export const getUserNotes = async () => {
    const response = await axios.get(`${API_URL}/api/dashboard/`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};
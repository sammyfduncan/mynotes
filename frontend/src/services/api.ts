import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

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
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
      'guest-id': guestId
    },
  });
  return response.data;
};

export const getNoteResult = async (contentId: number, guestId: string) => {
  const response = await axios.get(`${API_URL}/api/results/${contentId}`, {
    headers: {
      ...getAuthHeaders(),
      'guest-id': guestId,
    },
  });
  return response.data;
};

export const downloadNote = async (contentId: number, guestId: string) => {
  const response = await axios.get(`${API_URL}/download/${contentId}`, {
    responseType: 'blob',
    headers: {
      ...getAuthHeaders(),
      'guest-id': guestId,
    },
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData);
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/users/`, { email, password });
    return response.data;
};

export const getLoggedInUser = async () => {
    const response = await axios.get(`${API_URL}/users/me`, { headers: getAuthHeaders() });
    return response.data;
};

export const getUserNotes = async () => {
    const response = await axios.get(`${API_URL}/api/dashboard/`, { headers: getAuthHeaders() });
    return response.data;
};

export const deleteNote = async (contentId: number) => {
    const response = await axios.delete(`${API_URL}/api/results/${contentId}`, { headers: getAuthHeaders() });
    return response.data;
};

export const renameNote = async (contentId: number, newFilename: string) => {
    const response = await axios.patch(`${API_URL}/api/results/${contentId}`, { filename: newFilename }, { headers: getAuthHeaders() });
    return response.data;
};

export const updateNoteContent = async (contentId: number, newContent: string) => {
    const response = await axios.patch(`${API_URL}/api/results/${contentId}`, { notes: newContent }, { headers: getAuthHeaders() });
    return response.data;
};

export const submitContactForm = async (name: string, email: string, subject: string, message: string) => {
    const response = await axios.post(`${API_URL}/contact`, { name, email, subject, message });
    return response.data;
};

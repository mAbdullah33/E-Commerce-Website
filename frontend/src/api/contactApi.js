import api from './axios';

export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const getAllMessages = async (params = {}) => {
  const response = await api.get('/contact', { params });
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/contact/${id}/read`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

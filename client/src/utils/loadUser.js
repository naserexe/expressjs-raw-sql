import axios from 'axios';

export const loadUserAPI = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
  return response.data;
};

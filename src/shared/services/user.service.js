import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Get all users
export const getUsers = async () => {
  const response = await axios.get(`${BACKEND_API}/api/v1/users`);
  return response.data;
};

// Location Service
export const getLocation = async () => {
  const response = await axios.get(`https://api.db-ip.com/v2/free/self`);
  return response.data;
};

// Save Visitor Log
export const saveLog = async (data) => {
  const response = await axios.post(`${BACKEND_API}/api/v1/activity`, data);
  return response.data;
};

import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Get all users
export const getUsers = async () => {
  const response = await axios.get(`${BACKEND_API}/api/v1/users`);
  return response.data;
};

// Get a user
export const getUser = async (id) => {
  const response = await axios.get(`${BACKEND_API}/api/v1/users/${id}`);
  return response.data;
};

// Get user logs. Get by userId
export const getUserLogs = async () => {
  const response = await axios.get(`${BACKEND_API}/api/v1/userlogs`);
  return response.data;
};

// Save user action / activity log
export const saveUserLogs = async (payload) => {
  const response = await axios.post(`${BACKEND_API}/api/v1/userlogs`, payload);
  return response.data;
}

// Update user details: u for Update
export const uUser = async (data) => {
  const response = await axios.put(
    `${BACKEND_API}/api/v1/users/${data.userId}`,
    data
  );
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

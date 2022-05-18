import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Get all words
export const getWords = async () => {
  const response = await axios.get(`${BACKEND_API}/api/v1/words`);
  return response.data;
};

// Add a word
export const addNewWord = async (data) => {
  const response = await axios.post(`${BACKEND_API}/api/v1/addword`, data);
  return response.data;
};

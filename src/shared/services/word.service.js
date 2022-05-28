import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Get all words
export const getWords = async () => {
  const response = await axios.get(`${BACKEND_API}/api/v1/words`);
  return response.data;
};

// Add a word
export const addNewWord = async (data) => {
  const response = await axios.post(`${BACKEND_API}/api/v1/words`, data);
  return response.data;
};

// Add a word
export const uWord = async (data) => {
  const response = await axios.put(
    `${BACKEND_API}/api/v1/words/${data.wordId}`,
    data
  );
  return response.data;
};

// Search if a word exists
export const getWord = async (word) => {
  const response = await axios.get(`${BACKEND_API}/api/v1/fetchword/${word}`);
  return response.data;
};

// Search if a word exists
export const searchWord = async (word) => {
  const response = await axios.get(`${BACKEND_API}/api/v1/wordsearch/${word}`);
  return response.data;
};

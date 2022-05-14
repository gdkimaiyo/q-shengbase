import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Add a word
export const addNewWord = async (data) => {
  const response = await axios.post(`${BACKEND_API}/api/v1/addword`, data);
  return response.data;
};

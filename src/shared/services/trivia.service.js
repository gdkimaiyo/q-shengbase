import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

// Get a trivia by week
export const getTrivia = async (week) => {
  const response = await axios.get(`${BACKEND_API}/api/v1/trivia/${week}`);
  return response.data;
};

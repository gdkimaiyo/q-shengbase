import axios from "axios";
import { BACKEND_API } from "../../secrets.config";

class AuthService {
  async login(user) {
    const response = await axios.post(`${BACKEND_API}/api/v1/login`, user);
    if (response.data.data.token) {
      localStorage.setItem("sb_user", JSON.stringify(response.data.data));
    }
    return response.data;
  }

  async register(user) {
    const response = await axios.post(`${BACKEND_API}/api/v1/register`, user);
    return response.data;
  }

  logout() {
    localStorage.removeItem("sb_user");
  }
}
export default new AuthService();

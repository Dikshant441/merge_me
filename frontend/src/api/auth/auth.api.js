import { AxiosClient } from "../axiosClient";

class AuthApi extends AxiosClient {
  async signup(data) {
    return this.client.post("/auth/signup", data);
  }

  async login(data) {
    return this.client.post("/auth/login", data);
  }

  async me() {
    return this.client.get("/auth/me");
  }

  async logout() {
    return this.client.post("/auth/logout", {});
  }
}

export const authApi = new AuthApi();

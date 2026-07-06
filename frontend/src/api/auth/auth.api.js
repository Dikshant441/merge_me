import { AxiosClient } from "../axiosClient";

class AuthApi extends AxiosClient {
  async signup(data) {
    return this.client.post("/auth/signup", data);
  }

  async login(data) {
    return this.client.post("/auth/login", data);
  }

  async verifyEmail(token) {
    return this.client.post("/auth/verify-email", { token });
  }

  async requestPasswordReset(email) {
    return this.client.post("/auth/password-reset/request", { email });
  }

  async resendPasswordReset(token) {
    return this.client.post("/auth/password-reset/resend", { token });
  }

  async confirmPasswordReset(data) {
    return this.client.post("/auth/password-reset/confirm", data);
  }

  async me() {
    return this.client.get("/auth/me");
  }

  async updateProfile(patch) {
    return this.client.patch("/auth/me", patch);
  }

  async logout() {
    return this.client.post("/auth/logout", {});
  }
}

export const authApi = new AuthApi();

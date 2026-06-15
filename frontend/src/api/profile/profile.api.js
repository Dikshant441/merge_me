import { AxiosClient } from "../axiosClient";

class ProfileApi extends AxiosClient {
  async viewProfile() {
    return this.client.get("/profile/view");
  }

  async editProfile(data) {
    return this.client.patch("/profile/edit", data);
  }
}

export const profileApi = new ProfileApi();

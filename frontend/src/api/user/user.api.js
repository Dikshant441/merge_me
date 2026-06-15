import { AxiosClient } from "../axiosClient";

class UserApi extends AxiosClient {
  async getConnections() {
    return this.client.get("/user/connections");
  }

  async getReceivedRequests() {
    return this.client.get("/user/requests/received");
  }

  async reviewRequest(status, requestId) {
    return this.client.post(`/request/review/${status}/${requestId}`, {});
  }
}

export const userApi = new UserApi();

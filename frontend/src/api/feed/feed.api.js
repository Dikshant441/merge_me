import { AxiosClient } from "../axiosClient";

class FeedApi extends AxiosClient {
  async getFeed() {
    return this.client.get("/feed");
  }

  async sendRequest(status, userId) {
    return this.client.post(`/request/send/${status}/${userId}`, {});
  }
}

export const feedApi = new FeedApi();

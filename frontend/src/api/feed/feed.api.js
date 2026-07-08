import { AxiosClient } from "../axiosClient";

class FeedApi extends AxiosClient {
  async getFeed() {
    // Backend defaults to 10 per page; 50 is its max — grab a full deck.
    return this.client.get("/feed", { params: { limit: 50 } });
  }

  async sendRequest(status, userId) {
    return this.client.post(`/request/send/${status}/${userId}`, {});
  }
}

export const feedApi = new FeedApi();

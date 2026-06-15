import { AxiosClient } from "../axiosClient";

class ChatApi extends AxiosClient {
  async getChatHistory(targetUserId) {
    return this.client.get(`/chat/${targetUserId}`);
  }
}

export const chatApi = new ChatApi();

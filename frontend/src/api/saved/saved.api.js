import { AxiosClient } from "../axiosClient";

// Saved Collection endpoints. Pure bookmarks — completely separate from
// feedApi.sendRequest / the connection-request flow.
class SavedApi extends AxiosClient {
  // Bare array of saved users (newest first, same _id-aliased shape as /feed).
  async getSaved() {
    return this.client.get("/saved");
  }

  // Idempotent — saving an already-saved profile is a no-op.
  async save(userId) {
    return this.client.post(`/saved/${userId}`, {});
  }

  // Idempotent — unsaving something not saved is a no-op.
  async unsave(userId) {
    return this.client.delete(`/saved/${userId}`);
  }
}

export const savedApi = new SavedApi();

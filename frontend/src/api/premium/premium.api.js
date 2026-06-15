import { AxiosClient } from "../axiosClient";

class PremiumApi extends AxiosClient {
  async verifyPremium() {
    return this.client.get("/premium/verify");
  }

  async createPaymentOrder(membershipType) {
    return this.client.post("/payment/create", { membershipType });
  }
}

export const premiumApi = new PremiumApi();

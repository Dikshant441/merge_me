import axios from "axios";
import { BASEURL } from "../constants";

class AxiosClient {
  constructor() {
    this.api = axios.create({
      baseURL: BASEURL,
      withCredentials: true,
    });
  }

  get client() {
    return this.api;
  }
}

export { AxiosClient };

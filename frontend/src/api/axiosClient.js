import axios from "axios";
import { BASEURL } from "../constants";
import appStore from "../store";
import { removeUser } from "../store/user/slice";
import { broadcastLogout } from "../helpers/authChannel";
import { goToLogin } from "../helpers/navigation";

// Bare client used only to hit /auth/refresh — kept separate so its own
// failures never re-enter the interceptor below (no infinite loop).
const refreshClient = axios.create({ baseURL: BASEURL, withCredentials: true });

// Single-flight: if several requests 401 at once we refresh exactly once and
// they all await the same promise.
let refreshPromise = null;

// A 401 from these is a real auth answer (bad password, dead/expired token),
// not "access token expired" — so we don't try to refresh+retry them.
const isAuthEndpoint = (url = "") =>
  ["/auth/login", "/auth/signup", "/auth/verify-email", "/auth/refresh"].some((p) =>
    url.includes(p)
  );

const forceLogout = () => {
  if (appStore.getState().user) {
    appStore.dispatch(removeUser()); // clears persisted identity too
    broadcastLogout(); // sign out every other open tab
  }
  goToLogin();
};

class AxiosClient {
  constructor() {
    this.api = axios.create({
      baseURL: BASEURL,
      withCredentials: true,
    });
    this.api.interceptors.response.use(
      (res) => res,
      (error) => this.#onError(error)
    );
  }

  async #onError(error) {
    const { response, config } = error;

    // Not a retryable auth failure → bubble up untouched.
    if (!response || response.status !== 401 || !config || config._retried) {
      return Promise.reject(error);
    }
    // Anonymous visitor (no session in the store): a 401 is expected — e.g. the
    // public profile probe or a failed login. Leave it to the caller.
    if (!appStore.getState().user) return Promise.reject(error);
    // Logged in, but the failure is the auth call itself → genuinely signed out.
    if (isAuthEndpoint(config.url)) {
      forceLogout();
      return Promise.reject(error);
    }

    // Logged in + 401 on a normal request → access token expired. Refresh once
    // (shared), then replay the original request. If refresh fails, sign out.
    try {
      refreshPromise = refreshPromise ?? refreshClient.post("/auth/refresh");
      await refreshPromise;
      config._retried = true;
      return this.api(config);
    } catch (refreshErr) {
      forceLogout();
      return Promise.reject(refreshErr);
    } finally {
      refreshPromise = null;
    }
  }

  get client() {
    return this.api;
  }
}

export { AxiosClient };

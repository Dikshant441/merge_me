import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import appStore from "../../../store";
import Body from "../layouts/MainLayout";
import LogIn from "../../pages/LoginPage";
import Feed from "../../pages/FeedPage";
import Profile from "../../pages/ProfilePage";
import Connections from "../../pages/ConnectionsPage";
import Requests from "../../pages/RequestsPage";
import Premium from "../../pages/PremiumPage";
import Chat from "../../pages/ChatPage";
import LandingOrFeed from "../../pages/LandingOrFeedPage";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              {/* Index — landing for logged-out, feed for logged-in.
                  Two locale-prefixed URLs render the same gate; useLocale()
                  reads the segment to pick the COPY dictionary. */}
              <Route index element={<LandingOrFeed />} />
              <Route path="en-in" element={<LandingOrFeed />} />
              <Route path="hi-in" element={<LandingOrFeed />} />

              {/* Auth */}
              <Route path="login" element={<LogIn />} />
              <Route path="signup" element={<LogIn />} />

              {/* Protected — pages handle their own auth-redirect. */}
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="premium" element={<Premium />} />
              <Route path="chat/:userId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

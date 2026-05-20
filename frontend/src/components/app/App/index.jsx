import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import appStore from "../../../store";
import Body from "../layouts/MainLayout";
import AppShell from "../layouts/AppShell";
import LogIn from "../../pages/LoginPage";
import Feed from "../../pages/FeedPage";
import Profile from "../../pages/ProfilePage";
import Connections from "../../pages/ConnectionsPage";
import Requests from "../../pages/RequestsPage";
import Premium from "../../pages/PremiumPage";
import Help from "../../pages/HelpPage";
import LandingOrFeed from "../../pages/LandingOrFeedPage";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            {/* Public — landing + auth. Keeps the old MainLayout chrome. */}
            <Route path="/" element={<Body />}>
              <Route index element={<LandingOrFeed />} />
              <Route path="en-in" element={<LandingOrFeed />} />
              <Route path="hi-in" element={<LandingOrFeed />} />
              <Route path="login" element={<LogIn />} />
              <Route path="signup" element={<LogIn />} />
            </Route>

            {/* Protected — sidebar + topbar shell. Pages handle their own 401. */}
            <Route element={<AppShell />}>
              <Route path="feed" element={<Feed />} />
              <Route path="connections" element={<Connections />} />
              <Route path="chat/:userId" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="profile" element={<Profile />} />
              <Route path="premium" element={<Premium />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

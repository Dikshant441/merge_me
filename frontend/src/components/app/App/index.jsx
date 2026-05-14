import { BrowserRouter, Routes, Route, Link } from "react-router";
import LogIn from "../../pages/LoginPage";
import Body from "../layouts/MainLayout";
import { Provider } from "react-redux";
import appStore from "../../../store";
import Feed from "../../pages/FeedPage";
import Profile from "../../pages/ProfilePage";
import Connections from "../../pages/ConnectionsPage";
import Requests from "../../pages/RequestsPage";
import Premium from "../../pages/PremiumPage";
import Chat from "../../pages/ChatPage";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<LogIn />} />
              <Route path="/" element={<Feed />} />
              {/* change to /feed => / */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:userId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

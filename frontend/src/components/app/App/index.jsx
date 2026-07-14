import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import appStore, { persistor } from "../../../store";
import AuthSync from "../AuthSync";
import Body from "../layouts/MainLayout";
import AppShell from "../layouts/AppShell";
import LogIn from "../../pages/LoginPage";
import Feed from "../../pages/FeedPage";
import Profile from "../../pages/ProfilePage";
import Connections from "../../pages/ConnectionsPage";
import Chat from "../../pages/ChatPage";
import Requests from "../../pages/RequestsPage";
import Saved from "../../pages/SavedPage";
import Premium from "../../pages/PremiumPage";
import Help from "../../pages/HelpPage";
import LandingOrFeed from "../../pages/LandingOrFeedPage";
import VerifyEmail from "../../pages/VerifyEmailPage";
import ForgotPassword from "../../pages/ForgotPasswordPage";
import ResetPassword from "../../pages/ResetPasswordPage";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Provider store={appStore}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter basename="/">
            <AuthSync />
            <Routes>
            {/* Public — landing + auth. Keeps the old MainLayout chrome. */}
            <Route path="/" element={<Body />}>
              <Route index element={<LandingOrFeed />} />
              <Route path="en-in" element={<LandingOrFeed />} />
              <Route path="hi-in" element={<LandingOrFeed />} />
              <Route path="login" element={<LogIn />} />
              <Route path="signup" element={<LogIn />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected — sidebar + topbar shell. Pages handle their own 401. */}
            <Route element={<AppShell />}>
              <Route path="feed" element={<Feed />} />
              <Route path="connections" element={<Connections />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:userId" element={<Chat />} />
              <Route path="requests" element={<Requests />} />
              <Route path="saved" element={<Saved />} />
              <Route path="profile" element={<Profile />} />
              <Route path="premium" element={<Premium />} />
              <Route path="help" element={<Help />} />
            </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;

import { useSelector } from "react-redux";
import Landing from "../LandingPage";
import Feed from "../FeedPage";

// Index gate: logged-out visitors see the marketing landing page; logged-in
// users see their feed. The MainLayout chrome (Navbar + Footer) is hidden
// while Landing is shown — see MainLayout for the check.
const LandingOrFeed = () => {
  const user = useSelector((s) => s.user);
  return user ? <Feed /> : <Landing />;
};

export default LandingOrFeed;

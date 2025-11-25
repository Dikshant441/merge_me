import { BrowserRouter, Routes, Route, Link } from "react-router";
import LogIn from "./components/logIn";
import SignUp from "./components/signup";
import Body from "./components/Body";

function App() {
  return (
    <div className="">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

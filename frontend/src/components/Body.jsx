import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import axios from "axios";
import { BASEURL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetchUser = async () => {
    if (user) return;
    try {
      const user = await axios.get(BASEURL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(user?.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;

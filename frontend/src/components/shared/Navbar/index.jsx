import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { authApi } from "../../../api/auth/auth.api";
import { removeUser } from "../../../store/user/slice";
import { removeFeed } from "../../../store/feed/slice";
import { removeConnections } from "../../../store/connections/slice";
import { removeRequest } from "../../../store/requests/slice";
import Profile from "../../pages/ProfilePage";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandle = async () => {
    try {
      await authApi.logout();
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      // dispatch(removeRequest());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Merge Me
          </Link>
        </div>
        <div className="flex gap-2">
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="user logo" src={user.photoURL} />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between" > 
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/">Feed</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li>
                  <Link to="/premium">Premium</Link>
                </li>
                <li>
                  <a onClick={logouthandle}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

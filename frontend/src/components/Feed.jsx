import React from "react";
import { BASEURL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  const getFeed = async () => {
    if (feed) return;
    try {
      const feed = await axios.get(BASEURL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(feed.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
        return;
      }
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return <div className="">{feed && <UserCard user={feed[0]} />}</div>;
};

export default Feed;

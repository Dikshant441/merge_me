import axios from "axios";
import { BASEURL } from "../utils/constants";
import { useDispatch } from "react-redux";

const UserCard = ({ user }) => {
  const { _id, first_name, last_name, photoURL, age, gender, about, skills } =
    user;
  const dispatch = useDispatch();

  // const handleSendRequest = async (status, userId) => {
  //   try {
  //     const res = await axios.post(
  //       BASEURL + "/request/send/" + status + "/" + userId,
  //       {},
  //       { withCredentials: true }
  //     );
  //     dispatch(removeUserFromFeed(userId));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoURL} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{first_name + " " + last_name}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <p>{skills && skills.join(", ")}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            // onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            // onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;

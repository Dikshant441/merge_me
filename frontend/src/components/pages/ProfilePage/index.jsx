import { useSelector } from "react-redux";
import EditProfile from "../../features/profile/EditProfileForm";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};
export default Profile;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowingUsersAction } from "../redux/actions/userActions";
import PublicProfileCard from "../components/profile/PublicProfileCard";
import CommonLoading from "../components/loader/CommonLoading";

const Following = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const followingUsers = useSelector((state) => state.user?.followingUsers);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="main-section bg-white border">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4 text-center border-b py-3">
            People you're following
          </h2>
          {followingUsers?.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 items-center px-3 py-3">
              {followingUsers.map((user) => (
                <PublicProfileCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-700 flex justify-center items-center flex-col">
             
            <img className="" src="/nofollow.jpg" alt="no post" />
            <p className="text-lg font-semibold py-5">You're not following anyone yet.
            later!</p>
          </div>
           
          )}
        </div>
      )}
    </div>
  );
};

export default Following;

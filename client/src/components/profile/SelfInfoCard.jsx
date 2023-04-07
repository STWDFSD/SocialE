import React from "react";

const SelfInfoCard = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-2 my-5 shadow-[#F3F8FF]">
      <div className="flex flex-wrap items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Profile Summary</h3>
        <div className="text-sm text-gray-500">
          Joined {user.duration} ago (
          {new Date(user.createdAt).toLocaleDateString()})
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-sm text-gray-500">Total Posts</div>
        <div className="text-lg font-medium text-gray-800">
          {user.totalPosts}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-sm text-gray-500">Total Communities</div>
        <div className="text-lg font-medium text-gray-800">
          {user.totalCommunities}
        </div>
      </div>
      {user.totalPosts > 0 && (
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-sm text-gray-500">Posts in Communities</div>
          <div className="text-lg font-medium text-gray-800">
            {user.totalPosts} in {user.totalPostCommunities}{" "}
            {user.totalPostCommunities === 1 ? "community" : "communities"}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-sm text-gray-500">Followers</div>
        <div className="text-lg font-medium text-gray-800">
          {user.followers?.length ?? 0}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-sm text-gray-500">Following</div>
        <div className="text-lg font-medium text-gray-800">
          {user.following?.length ?? 0}
        </div>
      </div>
    </div>
  );
};

export default SelfInfoCard;

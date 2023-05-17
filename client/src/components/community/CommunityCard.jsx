import { useState } from "react";
import JoinModal from "../modals/JoinModal";
import placeholder from "../../assets/placeholder.png";
import { MdOutlineGroupAdd } from "react-icons/md";
const CommunityCard = ({ community }) => {
  const [joinModalVisibility, setJoinModalVisibility] = useState({});

  const toggleJoinModal = (communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  };
  return (
    <div className="shadow-2xl shadow-[#F3F8FF] bg-white px-4 py-2 w-full rounded-lg flex justify-between items-center">
      <div className="w-full flex items-center ">
        <img
          className="object-cover rounded-full w-10 h-10 mr-4"
          src={community.banner || placeholder}
          alt="community banner"
          loading="lazy"
        />
        <div className="">
          <h4 className="text-base font-semibold ">{community.name}</h4>
          <p className="text-gray-700 mb-2">
            {community.members.length} members
          </p>
        </div>
      </div>

      <div className="">
        <button
          onClick={() => toggleJoinModal(community._id, true)}
          className="px-2.5 py-2.5 bg-primary shadow-2xl shadow-[#F3F8FF] hover:bg-transparent group hover:border rounded-xl hover:border-primary transition duration-300"
        >
          <MdOutlineGroupAdd className="text-lg text-white group-hover:text-primary" />
        </button>
        <JoinModal
          show={joinModalVisibility[community._id] || false}
          onClose={() => toggleJoinModal(community._id, false)}
          community={community}
        />
      </div>
    </div>
  );
};

export default CommunityCard;

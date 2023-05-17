import { Link } from "react-router-dom";

const JoinedCommunityCard = ({ community }) => {
  return (
    <Link to={`/community/${community.name}`} className="flex flex-col ">
      <img className="" src={community.banner} alt="" loading="lazy" />
      <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
      <p className="text-gray-700 mb-2">{community.members.length} members</p>
    </Link>
  );
};

export default JoinedCommunityCard;

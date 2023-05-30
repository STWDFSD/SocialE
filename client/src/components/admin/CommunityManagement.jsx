import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunitiesAction,
  getModeratorsAction,
  addModeratorAction,
  removeModeratorAction,
  getCommunityAction,
} from "../../redux/actions/adminActions";

const CommunityManagement = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const moderators = useSelector((state) => state.admin?.moderators);
  const community = useSelector((state) => state.admin?.community);

  useEffect(() => {
    dispatch(getCommunitiesAction());
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityData, setSelectedCommunityData] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [newModerator, setNewModerator] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingCommunity, setIsChangingCommunity] = useState(false);

  const handleCommunitySelect = async (community) => {
    setSelectedCommunity(community);
    setIsChangingCommunity(true);
    await dispatch(getCommunityAction(community._id));
    setIsChangingCommunity(false);
  };

  useEffect(() => {
    setSelectedCommunityData(community);
  }, [community]);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator);
  };

  const handleRemoveModerator = async (moderator) => {
    setIsUpdating(true);
    await dispatch(
      removeModeratorAction(selectedCommunityData._id, moderator._id)
    );
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getModeratorsAction());
    setIsUpdating(false);
  };
  const handleAddModerator = async () => {
    setIsUpdating(true);
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setNewModerator("");
    setIsUpdating(false);
  };

  if (!communities || !moderators) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row h-screen">
      {/* Left column */}
      <div className="flex flex-col w-1/3 bg-gray-100">
        <h1 className="text-2xl font-bold p-4">Communities</h1>
        <div className="flex flex-col overflow-y-auto">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                selectedCommunity?._id === community._id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner}
                alt={community.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <span className="text-lg font-medium">{community.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col w-2/3 bg-white">
        {isChangingCommunity ? (
          <span>Loading...</span>
        ) : selectedCommunityData ? (
          <>
            <h1 className="text-2xl font-bold p-4">
              {selectedCommunityData.name}
            </h1>

            {isUpdating && (
              <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
                Updating...
              </div>
            )}
            <span>
              Total Moderators: {selectedCommunityData.moderatorCount}
            </span>
            <span>Total Members: {selectedCommunityData.memberCount}</span>

            <div className="flex flex-row p-4">
              {/* Moderators list */}
              <div className="flex flex-col w-1/2">
                <h2 className="text-lg font-medium mb-2">Moderators</h2>
                <div className="flex flex-col">
                  {selectedCommunityData.moderators?.map((moderator) => (
                    <div
                      key={moderator._id}
                      className={`p-2 cursor-pointer hover:bg-gray-200 ${
                        selectedModerator?._id === moderator._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => handleModeratorSelect(moderator)}
                    >
                      <span className="text-md font-medium">
                        {moderator.name}
                      </span>
                      <button
                        disabled={isUpdating}
                        className={`ml-2 text-red-500 hover:text-red-700 ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleRemoveModerator(moderator)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add moderator form */}
              <div className="flex flex-col w-1/2">
                <h2 className="text-lg font-medium mb-2">Add Moderator</h2>
                <div className="flex flex-row">
                  <select
                    className="p-2 border border-gray-400 rounded-l-md"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                  >
                    <option value="">Select a moderator</option>
                    {moderators?.map((moderator) => (
                      <option key={moderator._id} value={moderator._id}>
                        {moderator.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                    }
                    className={`p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700 ${
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAddModerator}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-lg font-medium text-gray-400">
              Select a community to view details
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;

const Community = require("../models/Community");
const ModerationRules = require("../models/ModerationRules");
const User = require("../models/User");
const getUserFromToken = require("../utils/getUserFromToken");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// Now Im going to send custom error messages to the client instead of the actual error message

// Get all communities
const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    // Send not found error
    res.status(404).json({
      message: "No communities found",
    });
  }
};

const getCommunity = async (req, res) => {
  try {
    const community = await Community.findOne({
      name: req.params.name,
    })
      .populate("rules")
      .lean();
    res.status(200).json(community);
  } catch (error) {
    res.status(404).json({
      message: "Community not found",
    });
  }
};

const createCommunity = async (req, res) => {
  try {
    const communities = req.body;
    const savedCommunities = await Community.insertMany(communities);
    res.status(201).json(savedCommunities);
  } catch (error) {
    res.status(409).json({
      message: "Error creating community",
    });
  }
};

const addRules = async (req, res) => {
  const rules = req.body;
  try {
    const savedRules = await ModerationRules.insertMany(rules);
    res.status(201).json(savedRules);
  } catch (error) {
    res.status(409).json({
      message: "Error creating rules",
    });
  }
};

const addRulesToCommunity = async (req, res) => {
  try {
    const { name } = req.params;
    const rules = await ModerationRules.find();

    const appliedRules = await Community.findOneAndUpdate(
      {
        name,
      },
      {
        $push: {
          rules,
        },
      },
      {
        new: true,
      }
    );
    res.status(201).json(appliedRules);
  } catch (error) {
    res.status(409).json({
      message: "Error adding rules to community",
    });
  }
};

const getMemberCommunities = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const communities = await Community.find({
      members: {
        $in: [userId],
      },
    });

    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({
      message: "Error getting communities",
    });
  }
};

const getNotMemberCommunities = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const communities = await Community.find({
      members: {
        $nin: [userId],
      },
      bannedUsers: {
        $nin: [userId],
      },
    });

    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({
      message: "Error getting communities",
    });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { name } = req.params;
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const community = await Community.findOneAndUpdate(
      {
        name,
      },
      {
        $push: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({
      message: "Error joining community",
    });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { name } = req.params;
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const community = await Community.findOneAndUpdate(
      {
        name,
      },
      {
        $pull: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({
      message: "Error leaving community",
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { id, name } = req.params;
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const community = await Community.findOneAndUpdate(
      {
        name,
      },
      {
        $pull: {
          members: id,
        },
        $push: {
          bannedUsers: id,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({
      message: "Error banning user from community",
    });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id, name } = req.params;
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const community = await Community.findOneAndUpdate(
      {
        name,
      },
      {
        $pull: {
          bannedUsers: id,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({
      message: "Error unbanning user from community",
    });
  }
};

const addModToCommunity = async (req, res) => {
  try {
    const userId = req.body.userId;
    const communityName = req.params.name;
    // Retrieve the user information from the database
    const currentUser = await User.findById(userId);

    // Check if the current user has the 'moderator' role
    if (currentUser.role !== "moderator") {
      return res.status(401).json({
        message: "Only moderators can be added.",
      });
    }

    // Update the community document with the new moderator
    await Community.findOneAndUpdate(
      {
        name: communityName,
      },
      {
        $addToSet: {
          moderators: userId,
          members: userId,
        },
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json(`User was added as a moderator and member of ${communityName}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const reportPost = async (req, res) => {
  try {
    const communityName = req.params.name;
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const community = await Community.findOneAndUpdate(
      {
        name: communityName,
        reportedPosts: {
          $not: {
            $elemMatch: {
              post: req.body.info.postId,
              reportedBy: userId,
            },
          },
        },
      },
      // if the user hasn't reported this post already, add the post to the reportedPosts array
      {
        $addToSet: {
          reportedPosts: {
            post: req.body.info.postId,
            reportedBy: userId,
            reportReason: req.body.info.reportReason,
            reportDate: new Date(),
          },
        },
      },
      {
        new: true,
      }
    );
    if (!community) {
      // user has already reported the post, return an error
      return res.status(400).json({
        message: "You have already reported this post.",
      });
    }

    const latestReportedPost = community.reportedPosts.slice(-1)[0];
    res.status(200).json(latestReportedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error reporting post",
    });
  }
};

const getReportedPosts = async (req, res) => {
  try {
    const communityName = req.params.name;
    const community = await Community.findOne({
      name: communityName,
    })
      .populate({
        path: "reportedPosts.reportedBy",
        model: "User",
        select: ["name", "avatar"],
      })
      .populate({
        path: "reportedPosts.post",
        model: "Post",
        select: ["_id", "body", "fileUrl", "createdAt", "user"],
        populate: {
          path: "user",
          model: "User",
          select: ["name", "avatar"],
        },
      })
      .lean();

    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }

    const reportedPosts = community.reportedPosts;

    reportedPosts.sort((a, b) => b.reportDate - a.reportDate);

    reportedPosts.forEach((post) => {
      post.reportDate = dayjs(post.reportDate).fromNow();
    });

    return res.status(200).json({
      reportedPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const removeReportedPost = async (req, res) => {
  try {
    const communityName = req.params.name;
    const postId = req.params.postId;
    // Find the community by name
    const community = await Community.findOne({
      name: communityName,
    });

    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }

    // Remove the reported post from the reportedPosts array
    const updatedCommunity = await Community.findOneAndUpdate(
      {
        name: communityName,
      },
      {
        $pull: {
          reportedPosts: {
            post: postId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCommunity) {
      return res.status(500).json({
        message: "Failed to remove reported post",
      });
    }

    res.status(200).json({
      message: "Reported post removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCommunityMembers = async (req, res) => {
  try {
    const communityName = req.params.name;
    const community = await Community.findOne({
      name: communityName,
    })
      .populate({
        path: "members",
        model: "User",
        select: ["name", "avatar", "createdAt", "_id", "location"],
        match: { role: { $ne: "moderator" } },
      })
      .populate({
        path: "bannedUsers",
        model: "User",
        select: ["name", "avatar", "createdAt", "_id", "location"],
      })
      .lean();

    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }

    const members = community.members;
    const bannedUsers = community.bannedUsers;

    return res.status(200).json({ members, bannedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getCommunityMods = async (req, res) => {
  try {
    const communityName = req.params.name;
    const community = await Community.findOne({
      name: communityName,
    })

      .populate({
        path: "moderators",
        model: "User",
        select: ["name", "avatar", "createdAt", "_id", "location"],
        match: { role: "moderator" },
      })
      .lean();

    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }

    const moderators = community.moderators;

    return res.status(200).json(moderators);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCommunities,
  getCommunity,
  createCommunity,
  addRulesToCommunity,
  addRules,
  getNotMemberCommunities,
  getMemberCommunities,
  joinCommunity,
  leaveCommunity,
  addModToCommunity,
  reportPost,
  getReportedPosts,
  removeReportedPost,
  getCommunityMembers,
  getCommunityMods,
  banUser,
  unbanUser,
};

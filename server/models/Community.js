const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
    },

    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    bannedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    reportedPosts: {
      type: [
        {
          post: { type: Schema.Types.ObjectId, ref: "Post" },
          reportedBy: { type: Schema.Types.ObjectId, ref: "User" },
          reportReason: { type: String },
          reportDate: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        default: [],
      },
    ],
  },

  {
    timestamps: true,
  }
);

communitySchema.index({ name: "text" });

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;

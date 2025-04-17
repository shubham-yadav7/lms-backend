import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    bannerImg: {
      type: String,
    },
    headingOne: {
      type: String,
    },
    headingTwo: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    bannerLinks: {
      trial: {
        type: String,
      },
      enroll: {
        type: String,
      },
    },
    offerItem: {
      type: mongoose.Types.ObjectId,
      refPath: "offerItemType",
    },
    offerItemType: {
      type: String,
      enum: ["course", "product"],
    },
    screenType: {
      type: String,
      enum: ["website", "app"],
      default: "website",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model("banner", schema);

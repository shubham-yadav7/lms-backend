import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
      required: true,
    },
    descp: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "blogCategory",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "blogTag",
        required: true,
      },
    ],
    thumbImg: {
      type: String,
      required: true,
    },
    documents: [
      {
        name: {
          type: String,
        },
        documentFile: {
          type: String,
        },
      },
    ],
    gallery: [
      {
        type: String,
      },
    ],
    saveAsDraft: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("blog", schema);

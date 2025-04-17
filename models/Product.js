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
    excerpt: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnailImage: {
      type: String,
    },
    thumbnailVideo: {
      type: String,
    },
    productGallery: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    language: [
      {
        type: mongoose.Types.ObjectId,
        ref: "courseLanguage",
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "productCategory",
    },
    levels: [
      {
        type: String,
        enum: ["advanced", "beginner", "intermediate"],
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    gallery: [
      {
        type: String,
      },
    ],
    status: {
      //status for active inactive
      type: Boolean,
      default: false,
    },
    publishStatus: {
      // just published status
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "reviews",
      },
    ],
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    SKU: {
      type: String,
    },
    quantityInStock: {
      type: Number,
      default: 0,
    },
    HSN: {
      type: String,
    },
    seo: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      scripts: {
        type: String,
      },
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

export const Product = mongoose.model("product", schema);

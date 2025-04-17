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
      required: [true, "Please enter title"],
    },
    slug: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please enter excerpt"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please enter price"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Please enter discounted price"],
    },
    access: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
    level: {
      type: String,
      required: [true, "Please provide course level."],
    },
    language: [
      {
        type: mongoose.Types.ObjectId,
        ref: "courseLanguage",
        required: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "courseCategory",
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "course",
      },
    ],
    duration: {
      totalSeconds: {
        type: Number,
      },
      inWords: {
        type: String,
      },
    },
    benefits: [
      {
        type: String,
      },
    ],
    materialsIncludes: [
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
    popular: {
      type: Boolean,
      default: false,
    },
    thumbnailImage: {
      type: String,
    },
    thumbnailVideo: {
      type: String,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "reviews",
      },
    ],
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

export const CourseBundle = mongoose.model("courseBundle", schema);

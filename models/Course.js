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
      required: [true, "Please enter title."],
    },
    slug: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please enter shot description."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Please provide course level."],
      enum: ["advanced", "beginner", "intermediate"],
    },
    access: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
    language: [
      {
        type: Schema.Types.ObjectId,
        ref: "courseLanguage",
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "courseCategory",
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    duration: {
      totalSeconds: {
        type: Number,
      },
      inWords: {
        type: String,
      },
    },
    price: {
      type: Number,
      required: [true, "Please enter price."],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Please enter discounted price."],
    },
    thumbnailVideo: {
      type: String,
    },
    thumbnailImage: {
      type: String,
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
    // topics: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "topics",
    //   },
    // ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
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
    instructor: [
      {
        type: Schema.Types.ObjectId,
        ref: "instructor",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    //   reviews: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: "review",
    //     },
    //   ],
    totalLessons: {
      type: Number,
      default: 0,
    },
    relatedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    coursePriority: {
      type: Number,
      default: 0,
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

export const Course = mongoose.model("course", schema);

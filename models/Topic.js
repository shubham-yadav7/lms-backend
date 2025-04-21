import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter topic title."],
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please enter topic description"],
    },
    paidDescription: {
      type: String,
      required: [true, "Please enter topic's paid description"],
    },
    videoLink: {
      type: String,
    },
    totalDuration: {
      totalSeconds: {
        type: Number,
      },
      inWords: {
        type: String,
      },
    },
    lessons: [
      {
        title: {
          type: String,
        },
        contentType: {
          type: String,
          enum: ["Text", "PDF", "Video"],
        },
        description: {
          type: String,
        },
        referenceUrl: {
          type: String,
        },
        pdfFile: {
          type: String,
        },
        platform: {
          type: String,
          enum: ["Youtube", "Vimeo", "Custom"],
        },
        link: {
          type: String,
        },
        customVideo: {
          type: String,
        },
        duration: {
          totalSeconds: {
            type: Number,
          },
          inWords: {
            type: String,
          },
        },
        practiceFiles: {
          link: [
            {
              type: String,
            },
          ],
          files: [
            {
              type: String,
            },
          ],
        },
        freeLesion: {
          type: Boolean,
          default: false,
        },
        setAsIntro: {
          type: Boolean,
          default: false,
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Topic = mongoose.model("topic", schema);

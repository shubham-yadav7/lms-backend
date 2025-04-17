import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { FeedbackVideo } from "../../models/FeedbackVideos.js";
import moment from "moment";
import ErrorHandler from "../../utils/ErrorHandler.js";

export const addFeedbackVideo = catchAsyncError(async (req, res, next) => {
  const { title, videoId } = req.body;

  if (!title || !videoId) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  await FeedbackVideo.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    videoId,
  });

  req.flash("success", "Feedback video added successfully.");
  res.redirect("/api/creator/feedback/list");
});
// Feedback videos with pagination
export const getAllFeedbackVideo = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  };
  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        title: regex,
      },
    ];
  }

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $sort: sort,
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $match: query,
          },
          {
            $count: "total",
          },
        ],
      },
    },
  ];

  const feedbackVideos = await FeedbackVideo.aggregate(aggregateQuery);

  res.render("creator/content-management/feedback-list", {
    feedbackVideos: feedbackVideos[0].data,
    total: feedbackVideos[0].metadata[0]
      ? Math.ceil(feedbackVideos[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
// Feedback videos without pagination
export const getAllFeedBackVideosList = catchAsyncError(
  async (req, res, next) => {
    const feedbackVideos = await FeedbackVideo.find({
      creator: req.creatorInfo._id,
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbackVideos,
    });
  }
);
export const editFeedbackVideo = catchAsyncError(async (req, res, next) => {
  const { title, videoId } = req.body;

  if (!title || !videoId) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  const feedbackVideo = await FeedbackVideo.findById(req.params.id);
  if (!feedbackVideo) return next(new ErrorHandler("Feedback not found", 404));

  feedbackVideo.title = title;
  feedbackVideo.videoId = videoId;

  await feedbackVideo.save();

  req.flash("success", "Feedback video updated successfully.");
  res.redirect("/api/creator/feedback/list");
});
export const deleteFeedbackVideo = catchAsyncError(async (req, res, next) => {
  const feedbackVideo = await FeedbackVideo.findById(req.params.id);
  if (!feedbackVideo) return next(new ErrorHandler("Feedback not found", 404));

  feedbackVideo.deleted = true;
  await feedbackVideo.save();

  req.flash("success", "Feedback video deleted successfully.");
  res.redirect("/api/creator/feedback/list");
});

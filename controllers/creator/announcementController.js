import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Announcement } from "../../models/Announcement.js";
import { Creator } from "../../models/Creator.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import moment from "moment";

// Creator
export const addAnnouncement = catchAsyncError(async (req, res, next) => {
  const { announcement, status } = req.body;
  if (!announcement)
    return next(new ErrorHandler("Announcement is required", 422));

  await Announcement.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    announcement,
    status: status === "true",
  });

  req.flash("success", "Announcement Created Successfully.");
  res.redirect("/api/creator/announcement/list");
});
export const getAllAnnouncement = catchAsyncError(async (req, res, next) => {
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
        announcement: regex,
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

  const announcements = await Announcement.aggregate(aggregateQuery);

  res.render("creator/content-management/announcement-list", {
    announcements: announcements[0].data,
    total: announcements[0].metadata[0]
      ? Math.ceil(announcements[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const editAnnouncement = catchAsyncError(async (req, res, next) => {
  let announcement = await Announcement.findById(req.params.id);
  if (!announcement)
    return next(new ErrorHandler("Announcement not found", 404));

  announcement.announcement = req.body.announcement;
  announcement.status = req.body.status === "true";

  await announcement.save();

  req.flash("success", "Announcement Updated successfully.");
  res.redirect("/api/creator/announcement/list");
});
export const deleteAnnouncement = catchAsyncError(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement)
    return next(new ErrorHandler("Announcement not found", 404));

  announcement.deleted = true;
  await announcement.save();

  req.flash("success", "Announcement Deleted Successfully.");
  res.redirect("/api/creator/announcement/list");
});

// Learner
export const getActiveAnnouncement = catchAsyncError(async (req, res, next) => {
  const announcement = await Announcement.findOne({
    creator: req.creatorInfo._id,
    status: true,
    deleted: false,
  }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    announcement,
  });
});

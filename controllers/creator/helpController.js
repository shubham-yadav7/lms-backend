import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import moment from "moment";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { Help } from "../../models/Help.js";
import { deleteFile } from "../../utils/deleteFile.js";
import slugify from "slugify";
import { sendResponse } from "../../utils/sendResponse.js";

export const addHelp = catchAsyncError(async (req, res, next) => {
  const { title, videoLink, description, status } = req.body;
  if (!title || !videoLink || !req.files.posterImage)
    return next(
      new ErrorHandler("Title, video link and poster image is required", 422)
    );

  let _help = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    videoLink,
    description,
    posterImage: req.files.posterImage[0].filename,
    status: status === "true",
  };

  await Help.create(_help);

  req.flash("success", "Help page added successfully");
  res.redirect("/api/creator/help/list");
});
export const getAllHelp = catchAsyncError(async (req, res, next) => {
  let _creator;
  const responseType = req.accepts(["html", "json"]);
  if (responseType === "html") {
    _creator = req.user.role === "creator" ? req.user._id : req.user.createdBy;
  } else if (responseType === "json") {
    _creator = req.creatorInfo._id;
  }

  let query = {
    creator: _creator,
    deleted: false,
  };
  if (req.query.type === "learner") {
    query.status = true;
  }

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
      {
        description: regex,
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

  const helps = await Help.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/content-management/help-list", {
    helps: helps[0].data,
    total: helps[0].metadata[0]
      ? Math.ceil(helps[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
    totalHelps: helps[0].metadata[0] ? helps[0].metadata[0].total : 0,
  });
});
export const editHelp = catchAsyncError(async (req, res, next) => {
  const { title, videoLink, description, status } = req.body;
  if (!title || !videoLink)
    return next(new ErrorHandler("Title and video link is required", 422));

  let help = await Help.findById(req.params.id);
  if (!help) return next(new ErrorHandler("Help not found", 404));

  if (help.title !== title) {
    help.slug = slugify(title, { lower: true });
  }
  help.title = title;
  help.videoLink = videoLink;
  help.description = description;
  help.status = status === "true";

  if (req.files.posterImage) {
    deleteFile(
      help.posterImage,
      `/uploads/help/posterImage/${help.posterImage}`
    );
    help.posterImage = req.files.posterImage[0].filename;
  }

  await help.save();
  req.flash("success", "Help page edited successfully");
  res.redirect("/api/creator/help/list");
});
export const deleteHelp = catchAsyncError(async (req, res, next) => {
  let help = await Help.findById(req.params.id);
  if (!help) return next(new ErrorHandler("Help not found", 404));

  help.deleted = true;
  await help.save();

  req.flash("success", "Help page deleted successfully");
  res.redirect("/api/creator/help/list");
});
export const addHelpFile = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    filename: req.files.stepImage[0].filename,
    backendUrl: process.env.BACKEND_URL,
  });
});
export const deleteHelpFile = catchAsyncError(async (req, res, next) => {
  if (req.params.image) {
    deleteFile(
      req.params.image,
      `./public/uploads/help/stepImage/${req.params.image}`
    );
  }
  res.sendStatus(200);
});
export const getHelpBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  const help = await Help.findOne({
    creator: req.creatorInfo._id,
    deleted: false,
    status: true,
    slug,
  });

  res.status(200).json({
    success: true,
    help,
  });
});

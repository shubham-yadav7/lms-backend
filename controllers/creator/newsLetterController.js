import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import moment from "moment";
import ErrorHandler from "./../../utils/ErrorHandler.js";
import { NewsLetter } from "../../models/NewsLetter.js";

export const addNewsLetter = catchAsyncError(async (req, res, next) => {
  if (!req.body.email) return next(new ErrorHandler("Email is required", 422));

  await NewsLetter.create({
    creator: req.creatorInfo._id,
    email: req.body.email,
  });

  res.status(200).json({
    success: true,
    message: "You successfully subscribed to our newsletter.",
  });
});
export const getAllNewsLetter = catchAsyncError(async (req, res, next) => {
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
        email: regex,
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

  const newsLetters = await NewsLetter.aggregate(aggregateQuery);
  res.render("creator/content-management/newsletter-list", {
    newsLetters: newsLetters[0].data,
    total: newsLetters[0].metadata[0]
      ? Math.ceil(newsLetters[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const deleteNewsLetter = catchAsyncError(async (req, res, next) => {
  let newsLetter = await NewsLetter.findById(req.params.id);
  if (!newsLetter) return next(new ErrorHandler("Newsletter not found", 404));

  newsLetter.deleted = true;
  await newsLetter.save();

  req.flash("success", "Newsletter deleted successfully");
  res.redirect("/api/creator/newsletter/list");
});

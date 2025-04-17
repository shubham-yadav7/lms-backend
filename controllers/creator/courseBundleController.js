import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { CourseBundle } from "../../models/CourseBundle.js";
import {
  status,
  modules,
  couponType,
  courseLevels,
  courseAccess,
} from "../../utils/presetData.js";
import { CourseLanguage } from "../../models/CourseLanguage.js";
import { CourseCategory } from "../../models/CourseCategory.js";
import slugify from "slugify";
import moment from "moment";
import { Course } from "../../models/Course.js";
import fs from "fs";
import { updateBundleDuration } from "../../utils/dataWatcher.js";
import mongoose from "mongoose";

export const addCourseBundle = catchAsyncError(async (req, res, next) => {
  const {
    title,
    excerpt,
    price,
    discountedPrice,
    level,
    access,
    language,
    category,
  } = req.body;

  if (
    !title ||
    !excerpt ||
    !price ||
    !discountedPrice ||
    !level ||
    !access ||
    !language ||
    !category
  ) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  if (Number(price) < Number(discountedPrice)) {
    return next(
      new ErrorHandler("Discounted price cannot be more than Actual price", 422)
    );
  }

  await CourseBundle.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    excerpt,
    price,
    discountedPrice,
    language,
    level,
    category,
    access,
  });

  req.flash("success", "Course bundle created successfully.");
  res.redirect("/api/creator/course-bundle/list");
});
export const getAllCourseBundles = catchAsyncError(async (req, res, next) => {
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

  if (req.query.sort) {
    if (req.query.sort === "popular") {
      sort = { createdAt: -1 };
      query.popular = true;
    } else {
      let a = req.query.sort.split("_");
      sort[a[0]] = Number(a[1]);
    }
  }

  if (req.query.filter) {
    switch (req.query.filter) {
      case "active":
        query.status = true;
        break;
      case "inactive":
        query.status = false;
        query.publishStatus = false;
        break;
      case "unpublished":
        query.status = false;
        query.publishStatus = true;
    }
  }

  if (req.query.languages) {
    let _lang = req.query.languages
      .split(",")
      .map((lang) => new mongoose.Types.ObjectId(lang));
    query.language = { $in: _lang };
  }

  if (req.query.categories) {
    let _cat = req.query.categories
      .split(",")
      .map((cat) => new mongoose.Types.ObjectId(cat));
    query.category = { $in: _cat };
  }

  if (req.query.levels) {
    query.level = { $in: req.query.levels.split(",") };
  }

  if (req.query.price) {
    switch (req.query.price) {
      case "all": {
        break;
      }
      case "free": {
        query.discountedPrice = 0;
        break;
      }
      case "paid": {
        query.discountedPrice = { $gt: 0 };
        break;
      }
      default: {
        return next(new ErrorHandler("Please select valid price option.", 422));
      }
    }
  }

  if (req.query.rating) {
    query.averageRating = {
      $gte: Number(req.query.rating),
      $lt: Number(req.query.rating) + 1,
    };
  }

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        title: regex,
      },
      {
        excerpt: regex,
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
      $lookup: {
        from: "courselanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courses",
        foreignField: "_id",
        as: "courses",
      },
    },
    {
      $lookup: {
        from: "coursecategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
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

  const courseLanguages = await CourseLanguage.find({
    creator: _creator,
    deleted: false,
  });
  const courseCategories = await CourseCategory.find({
    creator: _creator,
    deleted: false,
  });

  const courseBundles = await CourseBundle.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/course-bundle/course-bundle-list", {
    courseBundles: courseBundles[0].data,
    total: courseBundles[0].metadata[0]
      ? Math.ceil(courseBundles[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    courseLanguages,
    courseLevels,
    courseAccess,
    courseCategories,
    moment,
    totalBundles: courseBundles[0].metadata[0]
      ? courseBundles[0].metadata[0].total
      : 0,
  });
});
export const editCourseBundlePage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // languages
  const courseLanguages = await CourseLanguage.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  // categories
  const courseCategories = await CourseCategory.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  // courses
  const courses = await Course.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  }).sort({ createdAt: -1 });

  const courseBundle = await CourseBundle.findById(id);
  if (!courseBundle)
    return next(new ErrorHandler("Course bundle not found", 404));

  res.render("creator/course-bundle/course-bundle-view", {
    courseBundle,
    courseLanguages,
    courseCategories,
    courseLevels,
    courseAccess,
    moment,
    courses,
  });
});
export const editCourseBundle = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.query;
  let message;
  const {
    title,
    category,
    excerpt,
    level,
    access,
    language,
    price,
    discountedPrice,

    courses,
    thumbnailVideo,
    description,
    benefits,
    materialsIncludes,

    slug,
    seoTitle,
    seoDescription,
    seoScripts,

    status,
    popular,
  } = req.body;

  const courseBundle = await CourseBundle.findById(id);
  if (!courseBundle)
    return next(new ErrorHandler("Course bundle not found.", 404));

  let _bundle = {};

  switch (type) {
    case "details": {
      if (
        !title ||
        !excerpt ||
        !price ||
        !discountedPrice ||
        !level ||
        !access ||
        !language ||
        !category
      ) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      if (Number(price) < Number(discountedPrice)) {
        return next(
          new ErrorHandler(
            "Discounted price cannot be more than Actual price",
            422
          )
        );
      }

      _bundle.title = title;
      _bundle.slug = slugify(title, { lower: true });
      _bundle.excerpt = excerpt;
      _bundle.price = price;
      _bundle.discountedPrice = discountedPrice;
      _bundle.level = level;
      _bundle.access = access;
      _bundle.language = language;
      _bundle.category = category;

      message = "Bundle primary details updated successfully";
      break;
    }
    case "description": {
      if (!courses) {
        return next(new ErrorHandler("Please select at least one course", 400));
      }
      _bundle.courses = courses;
      _bundle.thumbnailVideo = thumbnailVideo;
      _bundle.description = description;
      _bundle.benefits = benefits.split("|");
      _bundle.materialsIncludes = materialsIncludes.split("|");

      if (req.files.bundleThumbnailImage) {
        if (
          fs.existsSync(
            `./public/uploads/bundle/thumbnails/${courseBundle.thumbnailImage}`
          )
        ) {
          fs.unlinkSync(
            `./public/uploads/bundle/thumbnails/${courseBundle.thumbnailImage}`
          );
        }
        _bundle.thumbnailImage = req.files.bundleThumbnailImage[0].filename;
      }

      await updateBundleDuration(id, courses);

      message = "Bundle descriptions updated successfully";
      break;
    }
    case "seo": {
      if (!slug) {
        return next(new ErrorHandler("product url is required.", 422));
      }
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return next(
          new ErrorHandler("Course bundle url format is invalid", 400)
        );
      }

      if (slug !== courseBundle.slug) {
        _bundle.slug = slugify(slug, { lower: true });
      }

      const seo = {
        title: seoTitle ? seoTitle : "",
        description: seoDescription ? seoDescription : "",
        scripts: seoScripts ? seoScripts : "",
      };

      _bundle.seo = seo;

      message = "Bundle SEO details updated successfully";
      break;
    }
    case "advanced": {
      _bundle.status = status === "true";
      _bundle.popular = popular === "true";
      _bundle.publishStatus = false;

      message = "Bundle advanced details updated successfully";
      break;
    }
  }
  await CourseBundle.findByIdAndUpdate(id, _bundle);
  req.flash("success", message);
  res.redirect(`/api/creator/course-bundle/${id}`);
});
export const deleteCourseBundle = catchAsyncError(async (req, res, next) => {
  const courseBundle = await CourseBundle.findById(req.params.id);
  if (!courseBundle)
    return next(new ErrorHandler("Course bundle not found.", 404));

  await CourseBundle.findByIdAndUpdate(req.params.id, { deleted: true });

  req.flash("success", "Course bundle deleted successfully.");
  res.redirect(`/api/creator/course-bundle/list`);
});
export const AllDeletedCourseBundles = catchAsyncError(
  async (req, res, next) => {
    let query = {
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      deleted: true,
    };
    let limit = parseInt(req.query.perPage) || 5;
    let page = req.query.page ? req.query.page : 1;
    let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 5);
    let search = req.query.search;

    if (search) {
      let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const regex = new RegExp(newSearchQuery, "gi");
      query.$or = [
        {
          title: regex,
        },
        {
          excerpt: regex,
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
        $lookup: {
          from: "courselanguages",
          localField: "language",
          foreignField: "_id",
          as: "language",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courses",
          foreignField: "_id",
          as: "courses",
        },
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

    const courseBundles = await CourseBundle.aggregate(aggregateQuery);

    res.render("creator/course-bundle/course-bundle-deleted", {
      courseBundles: courseBundles[0].data,
      total: courseBundles[0].metadata[0]
        ? Math.ceil(courseBundles[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
      moment,
    });
  }
);
export const restoreCourseBundle = catchAsyncError(async (req, res, next) => {
  const courseBundle = await CourseBundle.findById(req.params.id);
  if (!courseBundle)
    return next(new ErrorHandler("Course bundle not found.", 404));

  courseBundle.deleted = false;
  await courseBundle.save();

  req.flash("success", "Course bundle restore successfully.");
  res.redirect("/api/creator/course-bundle/list");
});
export const getBundleBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  let query = {
    creator: new mongoose.Types.ObjectId(req.creatorInfo._id),
    deleted: false,
    status: true,
    slug,
  };

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $lookup: {
        from: "courselanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $lookup: {
        from: "coursecategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "creators",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $set: {
        creator: { $arrayElemAt: ["$creator.brandName", 0] },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "ratings",
        foreignField: "_id",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courses",
        foreignField: "_id",
        as: "courses",
      },
    },
  ];

  const courseBundles = await CourseBundle.aggregate(aggregateQuery);

  res.status(200).json({
    success: true,
    courseBundles: courseBundles[0],
  });
});

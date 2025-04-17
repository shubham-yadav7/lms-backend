import slugify from "slugify";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { CourseCategory } from "../../models/CourseCategory.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { CourseLanguage } from "../../models/CourseLanguage.js";
import { Course } from "../../models/Course.js";
import { Instructor } from "../../models/Instructor.js";
import {
  status,
  modules,
  couponType,
  courseLevels,
  courseAccess,
} from "../../utils/presetData.js";
import { Topic } from "../../models/Topic.js";
import { sendResponse } from "../../utils/sendResponse.js";
import moment from "moment";
import fs from "fs";
import {
  contentReadDuration,
  customVideoDuration,
  pdfReadDuration,
  vimeoDuration,
  youtubeDuration,
} from "../../utils/videoDuration.js";
import { updateLessonCountAndDuration } from "../../utils/dataWatcher.js";
import mongoose from "mongoose";

// CATEGORY //
export const addCourseCategory = catchAsyncError(async (req, res, next) => {
  const { title, excerpt } = req.body;

  if (!title || !excerpt) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let category = await CourseCategory.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    excerpt,
    icon:
      req.files.categoryIcon[0].filename && req.files.categoryIcon[0].filename,
  });

  // For auto update category dropdown
  if (req.query.type && req.query.type === "autoset") {
    return res.status(200).json({
      category: category._id,
      success: true,
    });
  }

  req.flash("success", "Course category added successfully.");
  res.redirect("/api/creator/course/categories/list");
});
export const editCourseCategory = catchAsyncError(async (req, res, next) => {
  const { title, excerpt } = req.body;

  if (!title || !excerpt)
    return next(new ErrorHandler("All fields are required", 404));

  let courseCategory = await CourseCategory.findById(req.params.id);

  if (!courseCategory) return next(new ErrorHandler("Category not found", 404));

  let _category = {
    title: title,
    excerpt: excerpt,
  };

  if (courseCategory.title !== title) {
    _category.slug = slugify(title, { lower: true });
  }

  if (req.files.categoryIcon) {
    await deleteFile(
      courseCategory.icon,
      `./public/uploads/category/${courseCategory.icon}`
    );
    _category.icon = req.files.categoryIcon[0].filename;
  }

  await CourseCategory.findByIdAndUpdate(req.params.id, _category);

  req.flash("success", "Course category updated successfully.");
  res.redirect("/api/creator/course/categories/list");
});
export const deleteCourseCategory = catchAsyncError(async (req, res, next) => {
  let courseCategory = await CourseCategory.findById(req.params.id);

  if (!courseCategory) return next(new ErrorHandler("Category not found", 404));

  courseCategory.deleted = true;
  await courseCategory.save();

  req.flash("success", "Course category deleted successfully.");
  res.redirect("/api/creator/course/categories/list");
});
// With Pagination
export const getAllCourseCategories = catchAsyncError(
  async (req, res, next) => {
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
        {
          excerpt: regex,
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

    const courseCategories = await CourseCategory.aggregate(aggregateQuery);

    sendResponse(req, res, "creator/course/category/course-category-list", {
      success: true,
      courseCategories: courseCategories[0].data,
      total: courseCategories[0].metadata[0]
        ? Math.ceil(courseCategories[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
    });
  }
);
// Without pagination
export const getAllCourseCategoriesList = catchAsyncError(
  async (req, res, next) => {
    const courseCategories = await CourseCategory.find({
      creator: req.creatorInfo._id,
      deleted: false,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      courseCategories,
    });
  }
);

// LANGUAGE //
export const addCourseLanguage = catchAsyncError(async (req, res, next) => {
  if (!req.body.language)
    return next(new ErrorHandler("Language is required.", 400));

  const language = await CourseLanguage.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    name: req.body.language,
  });

  // For auto update language dropdown
  if (req.query.type && req.query.type === "autoset") {
    return res.status(200).json({
      language: language._id,
      success: true,
    });
  }
  req.flash("success", "Course language added successfully.");
  res.redirect("/api/creator/course/languages/list");
});
export const editCourseLanguage = catchAsyncError(async (req, res, next) => {
  if (!req.body.language)
    return next(new ErrorHandler("Language is required.", 400));

  let courseLanguage = await CourseLanguage.findById(req.params.id);
  if (!courseLanguage)
    return next(new ErrorHandler("Course language not found", 400));

  courseLanguage.name = req.body.language;

  await courseLanguage.save();
  req.flash("success", "Course language updated successfully.");
  res.redirect("/api/creator/course/languages/list");
});
export const deleteCourseLanguage = catchAsyncError(async (req, res, next) => {
  let courseLanguage = await CourseLanguage.findById(req.params.id);
  if (!courseLanguage)
    return next(new ErrorHandler("Course language not found", 400));

  courseLanguage.deleted = true;
  await courseLanguage.save();
  req.flash("success", "Course language deleted successfully.");
  res.redirect("/api/creator/course/languages/list");
});
export const getAllCourseLanguages = catchAsyncError(async (req, res, next) => {
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
        name: regex,
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

  const courseLanguages = await CourseLanguage.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/miscellaneous/language/language-list", {
    success: true,
    courseLanguages: courseLanguages[0].data,
    total: courseLanguages[0].metadata[0]
      ? Math.ceil(courseLanguages[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});

// COURSE //
export const addCourse = catchAsyncError(async (req, res, next) => {
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

  if (parseFloat(price) < parseFloat(discountedPrice))
    return next(
      new ErrorHandler("Discounted price can't be more than actual price", 400)
    );

  if (!title) return next(new ErrorHandler("Title is required", 400));

  let _course = new Course({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    excerpt,
    level,
    access,
    language,
    category,
    price,
    discountedPrice,
  });

  await Course.create(_course);

  req.flash("success", "Course Created Successfully.");
  res.redirect("/api/creator/course/list");
});
export const editCoursePage = catchAsyncError(async (req, res, next) => {
  const courseCategories = await CourseCategory.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  const courseLanguages = await CourseLanguage.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });
  const instructors = await Instructor.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  let course = await Course.findById(req.params.id);

  const relatedCourses = await Course.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    status: true,
    deleted: false,
    _id: { $nin: [course._id] },
  });
  sendResponse(req, res, "creator/course/details/course-details", {
    success: true,
    course,
    courseCategories,
    courseLanguages,
    relatedCourses,
    courseLevels,
    courseAccess,
    instructors,
  });
});
export const editCourse = catchAsyncError(async (req, res, next) => {
  const {
    title,
    excerpt,
    level,
    access,
    language,
    category,
    price,
    discountedPrice,

    description,
    thumbnailVideo,
    benefits,
    materialsIncludes,
    // instructor,
    relatedCourses,

    courseSlug,
    seoTitle,
    seoDescription,
    seoScripts,

    status,
    popular,
    downloadable,
    // coursePriority,
    // duration,
  } = req.body;
  const { type } = req.query;

  const course = await Course.findById(req.params.id);
  let _course = {};

  switch (type) {
    case "basic-info": {
      if (
        !title ||
        !category ||
        !excerpt ||
        !level ||
        !access ||
        !language ||
        !price ||
        !discountedPrice
      ) {
        return next(new ErrorHandler("All fields are required", 400));
      }
      if (parseFloat(price) < parseFloat(discountedPrice))
        return next(
          new ErrorHandler(
            "Discounted price can't be more than actual price",
            400
          )
        );

      _course.title = title;
      _course.slug = slugify(title, { lower: true });
      _course.category = category;
      _course.excerpt = excerpt.trim();
      _course.level = level;
      _course.access = access;
      _course.language = language;
      _course.price = price;
      _course.discountedPrice = discountedPrice;
      break;
    }
    case "description-info": {
      if (
        !description ||
        !thumbnailVideo ||
        !benefits ||
        !materialsIncludes 
      ) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      _course.description = description;
      _course.thumbnailVideo = thumbnailVideo;
      _course.benefits = benefits.split("|");
      _course.materialsIncludes = materialsIncludes.split("|");
      // _course.instructor = instructor;
      _course.relatedCourses = relatedCourses;

      if (req.files.thumbnailImage) {
        await deleteFile(
          course.thumbnailImage,
          `./public/uploads/courses/thumbnails/${course.thumbnailImage}`
        );
        _course.thumbnailImage = req.files.thumbnailImage[0].filename;
      }

      break;
    }
    case "seo-info": {
      if (!courseSlug) {
        return next(new ErrorHandler("product url is required.", 422));
      }
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(courseSlug)) {
        return next(new ErrorHandler("Course url format is invalid", 400));
      }

      if (courseSlug !== course.slug) {
        _course.slug = slugify(courseSlug, { lower: true });
      }

      const seo = {
        title: seoTitle ? seoTitle : "",
        description: seoDescription ? seoDescription : "",
        scripts: seoScripts ? seoScripts : "",
      };

      _course.seo = seo;

      break;
    }
    case "advanced-info": {
      _course.status = status === "true";
      _course.popular = popular === "true";
      _course.downloadable = downloadable === "true";
      _course.publishStatus = false;
      break;
    }
  }

  await Course.findByIdAndUpdate(req.params.id, _course);

  req.flash("success", "Course updated successfully");
  res.redirect(`/api/creator/course/${req.params.id}`);
});
// Course with Pagination
export const getAllCourses = catchAsyncError(async (req, res, next) => {
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
      $unset: "topics",
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

  const courseCategories = await CourseCategory.find({
    creator: _creator,
    deleted: false,
  });
  const courseLanguages = await CourseLanguage.find({
    creator: _creator,
    deleted: false,
  });

  const courses = await Course.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/course/course-list", {
    courses: courses[0].data,
    total: courses[0].metadata[0]
      ? Math.ceil(courses[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
    courseLevels,
    courseAccess,
    courseCategories,
    courseLanguages,
    totalCourses: courses[0].metadata[0] ? courses[0].metadata[0].total : 0,
  });
});
// course without pagination
export const getAllCoursesList = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.creatorInfo._id,
    deleted: false,
    status: true,
  };

  if (req.query.type === "popular") {
    query.popular = true;
  }

  // Add more queries according to requirements

  const courses = await Course.find(query);

  res.status(200).json({
    success: true,
    courses,
  });
});
export const getCourseBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  //  Course Details | topics | reviews and rating
  // Instructor All courses count

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
        from: "instructors",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
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
      $lookup: {
        from: "reviews",
        localField: "ratings",
        foreignField: "_id",
        as: "ratings",
      },
    },
    {
      $set: {
        creator: { $arrayElemAt: ["$creator.brandName", 0] },
      },
    },
  ];

  const course = await Course.aggregate(aggregateQuery);

  // Count total courses of instructor
  let countArr = [];
  // 📝 Always prefer "For of loop" instead of foreach in asynchronous operations.
  for (const inst of course[0].instructor || []) {
    const _count = await Course.countDocuments({
      instructor: inst._id,
      deleted: false,
      status: true,
      creator: req.creatorInfo._id,
    });
    countArr.push({
      instructor: inst._id.toString(),
      count: _count,
    });
  }

  // course topics
  const topics = await Topic.find({
    creator: req.creatorInfo._id,
    course: course[0]._id,
    deleted: false,
  });

  res.status(200).json({
    success: true,
    course: course[0],
    totalInstructorCourses: countArr,
    topics,
  });
});
export const deletedCourses = catchAsyncError(async (req, res, next) => {
  // pagination pending
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
      $unset: "topics",
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

  const courses = await Course.aggregate(aggregateQuery);

  res.render("creator/course/course-deleted", {
    courses: courses[0].data,
    total: courses[0].metadata[0]
      ? Math.ceil(courses[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const deleteCourse = catchAsyncError(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course not found", 400));

  if (course.deleted === true)
    return next(new ErrorHandler("Course is already deleted", 400));

  course.deleted = true;
  await course.save();

  req.flash("success", "Course deleted successfully");
  res.redirect("/api/creator/course/list");
});
export const restoreDeletedCourse = catchAsyncError(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course not found", 400));

  course.deleted = false;
  await course.save();

  req.flash("success", "Course restored successfully");
  res.redirect("/api/creator/course/list");
});

// TOPICS //
export const courseTopicAdd = catchAsyncError(async (req, res, next) => {
  let { title, description } = req.body;

  let course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course not found", 400));

  let _topic = new Topic({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    course: course._id,
    title,
    slug: slugify(title, { lower: true }),
    description,
    deleted: false,
  });

  await Topic.create(_topic);

  // Count and save total lessons
  let totalLessons = await Topic.countDocuments({
    deleted: false,
    course: course._id,
  });
  course.totalLessons = totalLessons;
  await course.save();

  req.flash("success", "Course topic added successfully");
  res.redirect(`/api/creator/course/${course._id}/topic/list`);
});
export const getAllCourseTopics = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandler("Course not found", 400));

  const topics = await Topic.find({
    course: req.params.id,
    deleted: false,
  });

  let introVideo = topics.map((topic) =>
    topic.lessons.find((less) => less.setAsIntro)
  );
  introVideo = introVideo.filter((int) => int);

  res.render("creator/course/details/topics", {
    course,
    topics,
    backendUrl: process.env.BACKEND_URL,
    introVideo: introVideo.length > 0 ? introVideo[0] : undefined,
  });
});
export const courseTopicEdit = catchAsyncError(async (req, res, next) => {
  const { id, topicId } = req.params;
  const { editType, lessonId } = req.query;
  let resMessage;
  let {
    title,
    description,
    topicTitle,
    contentType,
    topicDescription,
    referenceUrl,
    platform,
    link,
    freeLesion,
    setAsIntro,
    practiceLink,
    practiceFiles,
  } = req.body;

  const topic = await Topic.findById(topicId);
  if (!topic) return next(new ErrorHandler("Topic not found", 404));

  switch (editType) {
    // Edit section Form
    case "sectionEdit": {
      topic.title = title;
      topic.slug = slugify(title, { lower: true });
      topic.description = description;
      await topic.save();
      resMessage = "Section updated successfully.";
      break;
    }
    // Add Topic Form
    case "topicAdd": {
      let _lesson = {
        title: topicTitle,
        contentType,
        freeLesion: freeLesion ? true : false,
        practiceFiles: {
          link: [],
          files: [],
        },
      };
      if (Array.isArray(practiceLink)) {
        _lesson.practiceFiles.link = practiceLink.filter((e) => e);
      } else if (practiceLink) {
        _lesson.practiceFiles.link.push(practiceLink);
      }

      if (req.files.practiceFiles && req.files.practiceFiles.length !== 0) {
        req.files.practiceFiles.map((file) =>
          _lesson.practiceFiles.files.push(file.filename)
        );
      }

      switch (contentType) {
        case "Text": {
          _lesson.description = topicDescription;
          _lesson.referenceUrl = referenceUrl;
          _lesson.duration = contentReadDuration(topicDescription);
          break;
        }
        case "PDF": {
          _lesson.pdfFile = req.files.pdfFile[0].filename;
          _lesson.duration = await pdfReadDuration(
            req.files.pdfFile[0].filename
          );
          break;
        }
        case "Video": {
          _lesson.platform = platform;
          _lesson.link = platform === "Youtube" ? link[0] : link[1];
          _lesson.setAsIntro = setAsIntro ? true : false;

          if (platform === "Youtube") {
            let youtubeId = link[0].split("v=").at(-1);
            let duration = await youtubeDuration(youtubeId);
            _lesson.duration = duration;
          }
          if (platform === "Vimeo") {
            let vimeoId = link[1].split("/").at(-1).split("?")[0];
            let duration = await vimeoDuration(vimeoId);
            _lesson.duration = duration;
          }
          if (platform === "Custom") {
            _lesson.customVideo = req.files.customVideo[0].filename;

            let duration = await customVideoDuration(
              `./public/uploads/topics/topic-assets/${req.files.customVideo[0].filename}`
            );
            _lesson.duration = duration;
          }
          break;
        }
      }
      topic.lessons.push(_lesson);
      await topic.save();
      resMessage = "Topic added successfully.";
      break;
    }
    // Edit Topic Form
    case "topicEdit": {
      let selectedLesson = topic.lessons.find(
        (les) => les._id.toString() === lessonId
      );

      selectedLesson.title = topicTitle;
      selectedLesson.contentType = contentType;
      selectedLesson.freeLesion = freeLesion ? true : false;

      if (Array.isArray(practiceLink)) {
        selectedLesson.practiceFiles.link = practiceLink.filter((e) => e);
      } else {
        if (practiceLink) selectedLesson.practiceFiles.link.push(practiceLink);
      }

      practiceFiles = Array.isArray(practiceFiles)
        ? practiceFiles
        : [practiceFiles];

      if (req.files.practiceFiles && req.files.practiceFiles.length !== 0) {
        for (let i = 0; i < req.files.practiceFiles.length; i++) {
          let pos = practiceFiles.indexOf(
            req.files.practiceFiles[i].originalname
          );
          if (pos === -1) {
            selectedLesson.practiceFiles.files.push(
              req.files.practiceFiles[i].filename
            );
          } else {
            if (
              fs.existsSync(
                `./public/uploads/topics/practice-files/${selectedLesson.practiceFiles.files[pos]}`
              )
            ) {
              fs.unlinkSync(
                `./public/uploads/topics/practice-files/${selectedLesson.practiceFiles.files[pos]}`
              );
            }
            selectedLesson.practiceFiles.files[pos] =
              req.files.practiceFiles[i].filename;
          }
        }
      }

      if (!req.files.practiceFiles && practiceFiles[0]) {
        if (
          practiceFiles.length !== selectedLesson.practiceFiles.files.length
        ) {
          selectedLesson.practiceFiles.files.forEach((filename) => {
            if (!practiceFiles.includes(filename)) {
              if (
                fs.existsSync(
                  `./public/uploads/topics/practice-files/${filename}`
                )
              ) {
                fs.unlinkSync(
                  `./public/uploads/topics/practice-files/${filename}`
                );
              }
            }
          });
          selectedLesson.practiceFiles.files = practiceFiles;
        }
      }

      switch (contentType) {
        case "Text": {
          selectedLesson.description = topicDescription;
          selectedLesson.referenceUrl = referenceUrl;
          selectedLesson.duration = contentReadDuration(topicDescription);

          if (selectedLesson.pdfFile) {
            if (
              fs.existsSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              )
            ) {
              fs.unlinkSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              );
            }
            selectedLesson.pdfFile = undefined;
          }
          if (selectedLesson.platform) {
            selectedLesson.platform = undefined;
            selectedLesson.link = undefined;
            selectedLesson.setAsIntro = false;
            if (selectedLesson.customVideo) {
              if (
                fs.existsSync(
                  `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                )
              ) {
                fs.unlinkSync(
                  `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                );
              }
              selectedLesson.customVideo = undefined;
            }
          }
          break;
        }
        case "PDF": {
          if (req.files.pdfFile) {
            if (
              fs.existsSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              )
            ) {
              fs.unlinkSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              );
            }
            selectedLesson.pdfFile = req.files.pdfFile[0].filename;
            selectedLesson.duration = await pdfReadDuration(
              req.files.pdfFile[0].filename
            );
            selectedLesson.description = undefined;
            selectedLesson.referenceUrl = undefined;
            if (selectedLesson.platform) {
              selectedLesson.platform = undefined;
              selectedLesson.link = undefined;
              selectedLesson.setAsIntro = false;
              if (selectedLesson.customVideo) {
                if (
                  fs.existsSync(
                    `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                  )
                ) {
                  fs.unlinkSync(
                    `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                  );
                }
                selectedLesson.customVideo = undefined;
              }
            }
          }
          break;
        }
        case "Video": {
          selectedLesson.platform = platform;
          selectedLesson.link = platform === "Youtube" ? link[0] : link[1];

          await Topic.updateOne(
            { _id: topicId, "lessons.setAsIntro": true },
            { $set: { "lessons.$.setAsIntro": false } }
          );
          selectedLesson.setAsIntro = setAsIntro ? true : false;

          if (platform === "Youtube") {
            let youtubeId = link[0].split("v=").at(-1);
            let duration = await youtubeDuration(youtubeId);
            selectedLesson.duration = duration;
          }
          if (platform === "Vimeo") {
            let vimeoId = link[1].split("/").at(-1).split("?")[0];
            let duration = await vimeoDuration(vimeoId);
            selectedLesson.duration = duration;
          }
          if (platform === "Custom") {
            if (req.files.customVideo) {
              if (
                selectedLesson.customVideo &&
                fs.existsSync(
                  `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                )
              ) {
                fs.unlinkSync(
                  `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
                );
              }
              selectedLesson.customVideo = req.files.customVideo[0].filename;
              let duration = await customVideoDuration(
                `./public/uploads/topics/topic-assets/${req.files.customVideo[0].filename}`
              );
              selectedLesson.duration = duration;
            }
          }

          selectedLesson.description = undefined;
          selectedLesson.referenceUrl = undefined;
          if (selectedLesson.pdfFile) {
            if (
              fs.existsSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              )
            ) {
              fs.unlinkSync(
                `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
              );
            }
            selectedLesson.pdfFile = undefined;
          }
          break;
        }
      }
      await topic.save();
      resMessage = "Topic updated successfully.";
      break;
    }
  }

  await updateLessonCountAndDuration(id, topicId);

  req.flash("success", resMessage);
  res.redirect("back");
});
export const courseTopicDelete = catchAsyncError(async (req, res, next) => {
  const { deleteType, lessonId } = req.query;
  const { topicId, id } = req.params;

  let message;
  let topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorHandler("Topic not found", 400));
  }
  if (deleteType === "section") {
    topic.deleted = true;
    message = "Topic deleted successfully.";
    // Delete topic lessons in cron
  }
  if (deleteType === "lesson") {
    let selectedLesson = topic.lessons.find(
      (less) => less._id.toString() === lessonId
    );
    if (selectedLesson.contentType === "PDF") {
      if (
        fs.existsSync(
          `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
        )
      ) {
        fs.unlinkSync(
          `./public/uploads/topics/topic-assets/${selectedLesson.pdfFile}`
        );
      }
    }
    if (
      selectedLesson.contentType === "Video" &&
      selectedLesson.platform === "Custom"
    ) {
      if (
        fs.existsSync(
          `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
        )
      ) {
        fs.unlinkSync(
          `./public/uploads/topics/topic-assets/${selectedLesson.customVideo}`
        );
      }
    }

    if (
      selectedLesson.practiceFiles.files &&
      selectedLesson.practiceFiles.files.length > 0
    ) {
      selectedLesson.practiceFiles.files.forEach((filename) => {
        if (
          fs.existsSync(`./public/uploads/topics/practice-files/${filename}`)
        ) {
          fs.unlinkSync(`./public/uploads/topics/practice-files/${filename}`);
        }
      });
    }

    topic.lessons = topic.lessons.filter(
      (less) => less._id.toString() !== lessonId
    );
    message = "Topic lesson deleted successfully.";
  }

  await updateLessonCountAndDuration(id, topicId);

  await topic.save();
  req.flash("success", message);
  res.redirect("back");
});

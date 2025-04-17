import slugify from "slugify";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { FaqCategory } from "../../models/FaqCategories.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { FaqLanguage } from "../../models/FaqLanguage.js";
import { Faq } from "../../models/Faq.js";

// FAQ Category
export const addFaqCategories = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));

  await FaqCategory.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
  });

  req.flash("success", "FAQ Category Added Successfully.");
  res.redirect("/api/creator/faq/category/list");
});
export const getAllFaqCategories = catchAsyncError(async (req, res, next) => {
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

  const faqCategories = await FaqCategory.aggregate(aggregateQuery);

  res.render("creator/content-management/faq/faq-category", {
    faqCategories: faqCategories[0].data,
    total: faqCategories[0].metadata[0]
      ? Math.ceil(faqCategories[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});
export const editFaqCategories = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));

  let faqCategory = await FaqCategory.findById(req.params.id);
  if (!faqCategory) return next(new ErrorHandler("FAQ not found", 404));

  faqCategory.title = title;
  faqCategory.slug = slugify(title, { lower: true });

  await faqCategory.save();

  req.flash("success", "FAQ Category Edited Successfully.");
  res.redirect("/api/creator/faq/category/list");
});
export const deleteFaqCategories = catchAsyncError(async (req, res, next) => {
  let faqCategory = await FaqCategory.findById(req.params.id);
  if (!faqCategory) return next(new ErrorHandler("FAQ not found", 404));

  faqCategory.deleted = true;
  await faqCategory.save();

  req.flash("success", "FAQ Category Deleted Successfully.");
  res.redirect("/api/creator/faq/category/list");
});

// FAQ Language
export const addFaqLanguage = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));

  await FaqLanguage.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
  });

  req.flash("success", "FAQ Language Added Successfully.");
  res.redirect("/api/creator/faq/language/list");
});
export const getAllFaqLanguages = catchAsyncError(async (req, res, next) => {
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

  const faqLanguages = await FaqLanguage.aggregate(aggregateQuery);

  res.render("creator/content-management/faq/faq-language", {
    faqLanguages: faqLanguages[0].data,
    total: faqLanguages[0].metadata[0]
      ? Math.ceil(faqLanguages[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});
export const editFaqLanguage = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));

  let faqLanguage = await FaqLanguage.findById(req.params.id);
  if (!faqLanguage) return next(new ErrorHandler("FAQ not found", 404));

  faqLanguage.title = title;
  faqLanguage.slug = slugify(title, { lower: true });

  await faqLanguage.save();
  req.flash("success", "FAQ Language Updated Successfully.");
  res.redirect("/api/creator/faq/language/list");
});
export const deleteFaqLanguage = catchAsyncError(async (req, res, next) => {
  let faqLanguage = await FaqLanguage.findById(req.params.id);
  if (!faqLanguage) return next(new ErrorHandler("FAQ not found", 404));

  faqLanguage.deleted = true;
  await faqLanguage.save();
  req.flash("success", "FAQ Language Deleted Successfully.");
  res.redirect("/api/creator/faq/language/list");
});

// FAQ
export const addFaq = catchAsyncError(async (req, res, next) => {
  const { question, answer, language, category } = req.body;

  if (!question || !answer || !language) {
    return next(
      new ErrorHandler("Question, Answer and Language are required.", 422)
    );
  }

  let _faq = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    question,
    answer,
    language,
  };

  if (category) _faq.category = category;

  await Faq.create(_faq);
  req.flash("success", "FAQ Added Successfully.");
  res.redirect("/api/creator/faq/list");
});
// FAQ with pagination
export const getAllFaq = catchAsyncError(async (req, res, next) => {
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
        question: regex,
      },
      {
        answer: regex,
      },
      {
        "language.title": regex,
      },
      {
        "category.title": regex,
      },
    ];
  }

  let aggregateQuery = [
    {
      $lookup: {
        from: "faqlanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $unwind: { path: "$language", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "faqcategories",
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

  const faqs = await Faq.aggregate(aggregateQuery);

  const faqLanguages = await FaqLanguage.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  const faqCategories = await FaqCategory.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  res.render("creator/content-management/faq/faq-list", {
    faqs: faqs[0].data,
    total: faqs[0].metadata[0]
      ? Math.ceil(faqs[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    faqLanguages,
    faqCategories,
  });
});
// FAQ without pagination
export const getAllFaqsList = catchAsyncError(async (req, res, next) => {
  const { category } = req.query;

  let _query = {
    creator: req.creatorInfo._id,
    deleted: false,
  };

  if (category) {
    _query.category = category;
  }
  const faqs = await Faq.find(_query).sort({ createdAt: -1 });

  const categories = await FaqCategory.find({
    creator: req.creatorInfo._id,
    deleted: false,
  }).sort({ createdAt: -1 });

  const languages = await FaqLanguage.find({
    creator: req.creatorInfo._id,
    deleted: false,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    faqs,
    categories,
    languages,
  });
});
export const editFaq = catchAsyncError(async (req, res, next) => {
  const { question, answer, language, category } = req.body;

  if (!question || !answer || !language) {
    return next(
      new ErrorHandler("Question, Answer and Language are required.", 422)
    );
  }

  const faq = await Faq.findById(req.params.id);
  if (!faq) return next(new ErrorHandler("FAQ not found", 404));

  faq.question = question;
  faq.answer = answer;
  faq.language = language;
  faq.category = category;

  await faq.save();

  req.flash("success", "FAQ Updated Successfully.");
  res.redirect("/api/creator/faq/list");
});
export const deleteFaq = catchAsyncError(async (req, res, next) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) return next(new ErrorHandler("FAQ not found", 404));

  faq.deleted = true;

  await faq.save();
  req.flash("success", "FAQ Deleted Successfully.");
  res.redirect("/api/creator/faq/list");
});

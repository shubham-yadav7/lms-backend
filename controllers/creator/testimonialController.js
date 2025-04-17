import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Testimonial } from "../../models/Testimonials.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import moment from "moment";
import { deleteFile } from "../../utils/deleteFile.js";

export const addTestimonial = catchAsyncError(async (req, res, next) => {
  const { name, designation, description } = req.body;
  if (!name || !designation || !description || !req.files.testimonialProfile) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  await Testimonial.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    name,
    designation,
    description,
    profile: req.files.testimonialProfile[0].filename,
  });

  req.flash("success", "Testimonial Added successfully.");
  res.redirect("/api/creator/testimonial/list");
});
// Testimonial with pagination
export const getAllTestimonials = catchAsyncError(async (req, res, next) => {
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
      {
        designation: regex,
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

  const testimonials = await Testimonial.aggregate(aggregateQuery);
  res.render("creator/content-management/testimonial-list", {
    testimonials: testimonials[0].data,
    total: testimonials[0].metadata[0]
      ? Math.ceil(testimonials[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
// Testimonial without pagination
export const getAllTestimonialsList = catchAsyncError(
  async (req, res, next) => {
    const testimonials = await Testimonial.find({
      creator: req.creatorInfo._id,
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      testimonials,
    });
  }
);
export const editTestimonial = catchAsyncError(async (req, res, next) => {
  const { name, designation, description } = req.body;
  if (!name || !designation || !description) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  let testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return next(new ErrorHandler("Testimonial not found", 404));

  testimonial.name = name;
  testimonial.designation = designation;
  testimonial.description = description;

  if (req.files.testimonialProfile) {
    await deleteFile(
      testimonial.profile,
      `./public/uploads/testimonials/${testimonial.profile}`
    );
    testimonial.profile = req.files.testimonialProfile[0].filename;
  }

  await testimonial.save();
  req.flash("success", "Testimonial updated successfully.");
  res.redirect("/api/creator/testimonial/list");
});
export const deleteTestimonial = catchAsyncError(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return next(new ErrorHandler("Testimonial not found", 404));

  testimonial.deleted = true;
  await testimonial.save();

  req.flash("success", "Testimonial deleted successfully.");
  res.redirect("/api/creator/testimonial/list");
});

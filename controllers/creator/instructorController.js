import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Instructor } from "../../models/Instructor.js";
import moment from "moment";
import { sendResponse } from "../../utils/sendResponse.js";
import ErrorHandler from "./../../utils/ErrorHandler.js";
import slugify from "slugify";
import { deleteFile } from "../../utils/deleteFile.js";
import { modules } from "../../utils/presetData.js";

export const addInstructor = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    designation,
    password,
    confirmPassword,
    description,
    modules,
  } = req.body;

  if (!name || !email || !designation || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does't match", 422)
    );
  }

  let instructor = await Instructor.findOne({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    email,
  });

  if (instructor)
    return next(
      new ErrorHandler(`Instructor with ${email} email is already exists.`, 400)
    );

  let _instructor = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    name,
    slug: slugify(name, { lower: true }),
    email,
    designation,
    password,
    createdBy: req.user._id,
  };

  if (modules) {
    _instructor.modules = Array.isArray(modules) ? modules : [modules];
  }

  if (description) _instructor.description = description;
  if (req.files.profileImg) {
    _instructor.profileImg = req.files.profileImg[0].filename;
  }

  await Instructor.create(_instructor);
  req.flash("success", "Instructor Created Successfully.");
  res.redirect("/api/creator/instructor/list");
});
export const getAllInstructor = catchAsyncError(async (req, res, next) => {
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
        email: regex,
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

  const instructors = await Instructor.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/instructor/instructor-list", {
    instructors: instructors[0].data,
    total: instructors[0].metadata[0]
      ? Math.ceil(instructors[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
    modules,
  });
});
export const editInstructor = catchAsyncError(async (req, res, next) => {
  const { name, email, designation, description, modules } = req.body;
  if (!name || !email || !designation) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return next(new ErrorHandler("Instructor not found", 404));
  }

  instructor.name = name;
  instructor.email = email;
  instructor.designation = designation;
  instructor.description = description ? description : "";
  instructor.slug = slugify(name, { lower: true });

  if (modules) {
    instructor.modules = Array.isArray(modules) ? modules : [modules];
  }

  if (req.files.profileImg) {
    deleteFile(
      req.files.profileImg[0].filename,
      `./public/uploads/instructors/profile/${instructor.profileImg}`
    );
    instructor.profileImg = req.files.profileImg[0].filename;
  }

  await instructor.save();
  req.flash("success", "Instructor updated successfully.");
  if (req.query.from && req.query.from === "listing") {
    res.redirect("/api/creator/instructor/list");
  } else {
    res.redirect(`/api/creator/instructor/${req.params.id}`);
  }
});
export const deleteInstructor = catchAsyncError(async (req, res, next) => {
  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return next(new ErrorHandler("Instructor not found", 404));
  }

  instructor.deleted = true;
  await instructor.save();
  req.flash("success", "Instructor deleted successfully.");
  res.redirect("/api/creator/instructor/list");
});
export const getAllDeletedInstructor = catchAsyncError(
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
          name: regex,
        },
        {
          email: regex,
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
  
    const instructors = await Instructor.aggregate(aggregateQuery);
  
    res.render("creator/instructor/instructor-deleted", {
      instructors: instructors[0].data,
      total: instructors[0].metadata[0]
        ? Math.ceil(instructors[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
      moment,
    });
  }
);
export const restoreInstructor = catchAsyncError(async (req, res, next) => {
  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return next(new ErrorHandler("Instructor not found", 404));
  }

  instructor.deleted = false;
  await instructor.save();
  req.flash("success", "Instructor restored successfully.");
  res.redirect("/api/creator/instructor/list");
});
export const changeInstructorPassword = catchAsyncError(
  async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const instructor = await Instructor.findById(req.params.id).select(
      "+password"
    );

    if (!instructor) {
      return next(new ErrorHandler("Instructor not found", 404));
    }

    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(
          "New password and confirm password does not match",
          422
        )
      );
    }
    instructor.password = newPassword;
    await instructor.save();
    req.flash("success", "Password changed successfully.");
    if (req.query.from && req.query.from === "listing") {
      res.redirect("/api/creator/instructor/list");
    } else {
      res.redirect(`/api/creator/instructor/${req.params.id}`);
    }
  }
);
export const changeInstructorStatus = catchAsyncError(
  async (req, res, next) => {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return next(new ErrorHandler("Instructor not found", 404));
    }
    instructor.status = !(req.query.status === "true");
    await instructor.save();
    req.flash("success", "Instructor restored successfully.");
    if (req.query.from && req.query.from === "listing") {
      res.redirect("/api/creator/instructor/list");
    } else {
      res.redirect(`/api/creator/instructor/${req.params.id}`);
    }
  }
);
export const getInstructorDetails = catchAsyncError(async (req, res, next) => {
  const instructor = await Instructor.findOne({
    _id: req.params.id,
    deleted: false,
  });
  if (!instructor) {
    return next(new ErrorHandler("Instructor not found", 404));
  }
  res.render("creator/instructor/instructor-details", {
    instructor,
    moment,
    modules,
  });
});

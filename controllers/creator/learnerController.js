import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { Learner } from "../../models/Learner.js";
import moment from "moment";
import { deleteFile } from "../../utils/deleteFile.js";

export const addLearner = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    status,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler(`Password and Confirm Password Does'nt Match`)
    );
  }

  let _learner = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    createdByAdmin: true,
    firstName,
    lastName,
    email,
    phone,
    password,
    status: status === "true",
  };

  if (req.files.userProfileImg) {
    _learner.profileImg = req.files.userProfileImg[0].filename;
  }
  await Learner.create(_learner);

  req.flash("success", "Learner Created Successfully");
  res.redirect("/api/creator/learner/list");
});
export const getAllLearners = catchAsyncError(async (req, res, next) => {
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
        firstName: regex,
      },
      {
        lastName: regex,
      },
      {
        email: regex,
      },
      {
        phone: regex,
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

  const learners = await Learner.aggregate(aggregateQuery);

  res.render("creator/learner/learner-list", {
    learners: learners[0].data,
    total: learners[0].metadata[0]
      ? Math.ceil(learners[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const editLearner = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, status } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  const learner = await Learner.findById(req.params.id);
  if (!learner) {
    return next(new ErrorHandler("Learner not found", 404));
  }

  learner.firstName = firstName;
  learner.lastName = lastName;
  learner.email = email;
  learner.phone = phone;
  learner.status = status === "true";

  if (req.files.userProfileImg) {
    deleteFile(
      learner.profileImg,
      `./public/uploads/user/profile/${learner.profileImg}`
    );
    learner.profileImg = req.files.userProfileImg[0].filename;
  }

  await learner.save();

  req.flash("success", "Learner updated successfully.");
  res.redirect("/api/creator/learner/list");
});
export const deleteLearner = catchAsyncError(async (req, res, next) => {
  const learner = await Learner.findById(req.params.id);
  if (!learner) {
    return next(new ErrorHandler("Learner not found", 404));
  }

  learner.deleted = true;
  await learner.save();

  req.flash("success", "Learner deleted successfully.");
  res.redirect("/api/creator/learner/list");
});
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required.", 422));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password doesn't match", 422)
    );
  }
  const learner = await Learner.findById(req.params.id);
  if (!learner) {
    return next(new ErrorHandler("Learner not found", 404));
  }

  learner.password = password;
  await learner.save();

  req.flash("success", "Password changed successfully.");
  res.redirect("/api/creator/learner/list");
});
export const getLearnerDetails = catchAsyncError(async (req, res, next) => {
  const learner = await Learner.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!learner) return next(new ErrorHandler("Learner Not Found", 404));

  res.render("creator/learner/learner-details", {
    learner,
    moment,
  });
});
export const assignToLearner = catchAsyncError(async (req, res, next) => {});
export const learnerPurchases = catchAsyncError(async (req, res, next) => {});
export const exportLearners = catchAsyncError(async (req, res, next) => {});
export const getAllDeletedLearners = catchAsyncError(async (req, res, next) =>{
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
        firstName: regex,
      },
      {
        lastName: regex,
      },
      {
        email: regex,
      },
      {
        phone: regex,
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

  const learners = await Learner.aggregate(aggregateQuery);

  res.render("creator/learner/learner-deleted", {
    learners: learners[0].data,
    total: learners[0].metadata[0]
      ? Math.ceil(learners[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
})
export const restoreLearner = catchAsyncError(async (req, res, next) => {
  const learner = await Learner.findById(req.params.id);

  if (!learner) {
    return next(new ErrorHandler("Learner not found", 404));
  }

  learner.deleted = false;
  await learner.save();
  req.flash("success", "Learner restored successfully.");
  res.redirect("/api/creator/learner/list");
});
import moment from "moment";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Coupon } from "../../models/Coupon.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { Course } from "../../models/Course.js";
import { Product } from "../../models/Product.js";

export const addCoupon = catchAsyncError(async (req, res, next) => {
  const {
    couponType,
    code,
    couponValue,
    courses,
    products,
    minPurchaseAmount,
    discountUpTo,
    noOfUses,
    noOfUsesPerUser,
    expiredAt,
    status,
    onlyForNewUser,
  } = req.body;

  if (!couponType || !code || !couponValue) {
    return next(
      new ErrorHandler("Coupon type, Coupon code and amount is required.", 422)
    );
  }
  let _coupon = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    type: couponType,
    code: code.toUpperCase().split(" ").join("-"),
    couponValue,
    minPurchaseAmount,
    discountUpTo,
    noOfUses,
    noOfUsesPerUser,
    status: status === "active",
    onlyForNewUser: !noOfUses && onlyForNewUser === "true",
  };

  if (courses) {
    _coupon.courses = Array.isArray(courses) ? courses : [courses];
  }
  if (products) {
    _coupon.products = Array.isArray(products) ? products : [products];
  }
  if (expiredAt) {
    _coupon.expiredAt = moment(expiredAt).endOf("day");
  }
  await Coupon.create(_coupon);

  req.flash("success", "Coupon created successfully!");
  res.redirect("/api/creator/coupon/list");
});
export const getAllCoupons = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  };
  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;

  if (req.query.filter) {
    switch (req.query.filter) {
      case "active":
        query.status = true;
        break;
      case "inactive":
        query.status = false;
    }
  }

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        type: regex,
      },
      {
        code: regex,
      },
      {
        couponValue: regex,
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

  const coupons = await Coupon.aggregate(aggregateQuery);

  const courses = await Course.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  const products = await Product.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });

  sendResponse(req, res, "creator/coupon/coupons-list", {
    coupons: coupons[0].data,
    total: coupons[0].metadata[0]
      ? Math.ceil(coupons[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    courses,
    products,
    moment,
  });
});
export const editCoupon = catchAsyncError(async (req, res, next) => {
  const {
    couponType,
    code,
    couponValue,
    courses,
    products,
    minPurchaseAmount,
    discountUpTo,
    noOfUses,
    noOfUsesPerUser,
    expiredAt,
    status,
    onlyForNewUser,
  } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  coupon.type = couponType;
  coupon.code = code.toUpperCase().split(" ").join("-");
  coupon.couponValue = couponValue;

  if (courses) {
    coupon.courses = Array.isArray(courses) ? courses : [courses];
  }else {
    coupon.courses = []
  }
  if (products) {
    coupon.products = Array.isArray(products) ? products : [products];
  }else {
    coupon.products = []
  }
  if (expiredAt) {
    coupon.expiredAt = moment(expiredAt).endOf("day");
  }
  coupon.minPurchaseAmount = minPurchaseAmount;
  coupon.discountUpTo = discountUpTo;
  coupon.noOfUses = noOfUses;
  coupon.noOfUsesPerUser = noOfUsesPerUser;
  coupon.status = status === "active";
  coupon.onlyForNewUser = !noOfUses && onlyForNewUser === "true";

  await coupon.save();

  req.flash("success", "Coupon updated successfully!");
  res.redirect("/api/creator/coupon/list");
});
export const deleteCoupon = catchAsyncError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  coupon.deleted = true;
  await coupon.save();

  req.flash("success", "coupon deleted successfully.");
  res.redirect("/api/creator/coupon/list");
});
export const getAllDeletedCoupons = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: true,
  };
  let limit = parseInt(req.query.perPage) || 5;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 5);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        type: regex,
      },
      {
        code: regex,
      },
      {
        couponValue: regex,
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

  const coupons = await Coupon.aggregate(aggregateQuery);

  res.render( "creator/coupon/coupons-deleted", {
    coupons: coupons[0].data,
    total: coupons[0].metadata[0]
      ? Math.ceil(coupons[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
  // const coupons = await Coupon.find({
  //   creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
  //   deleted: true,
  // });

  // res.render("creator/coupon/coupons-deleted", { coupons, moment });
});
export const restoreCoupon = catchAsyncError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  coupon.deleted = false;
  await coupon.save();

  req.flash("success", "Coupon restored successfully.");
  res.redirect("/api/creator/coupon/list");
});

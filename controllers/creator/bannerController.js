import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Banner } from "../../models/Banner.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { sendResponse } from "../../utils/sendResponse.js";
import moment from "moment";
import { Course } from "../../models/Course.js";
import { Product } from "../../models/Product.js";

export const AddBanner = catchAsyncError(async (req, res, next) => {
  const {
    headingOne,
    headingTwo,
    description,
    trialLink,
    enrollLink,
    offerItem,
    offerItemType,
    screenType,
  } = req.body;

  if (!req.files.bannerImage)
    return next(new ErrorHandler("Banner image is required", 422));

  let _banner = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    bannerImg: req.files.bannerImage[0].filename,
    headingOne,
    headingTwo,
    description,
    bannerLinks: {
      trial: trialLink ? trialLink : undefined,
      enroll: enrollLink ? enrollLink : undefined,
    },
    offerItem,
    offerItemType: offerItemType ? offerItemType : undefined,
    screenType,
  };

  await Banner.create(_banner);

  req.flash("success", "Banner Created Successfully");
  res.redirect("/api/creator/banner/list");
});
// Banner with pagination
export const getAllBanners = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  };

  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;
  let filter = req.query.filter;

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        headingOne: regex,
      },
      {
        headingTwo: regex,
      },
      {
        description: regex,
      },
    ];
  }

  if (filter) {
    query.screenType = filter;
  }

  const totalBannerCount = await Banner.countDocuments(query);
  const banners = await Banner.find(query)
    .populate("offerItem")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const offerCourses = await Course.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
    status: true,
  });

  const offerProducts = await Product.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
    status: true,
  });

  sendResponse(req, res, "creator/content-management/banner-list", {
    banners,
    total: Math.ceil(totalBannerCount / limit),
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
    offerCourses,
    offerProducts,
  });
});
// Banner without pagination
export const getAllBannersList = catchAsyncError(async (req, res, next) => {
  const banners = await Banner.find({
    creator: req.creatorInfo._id,
    deleted: false,
    screenType: req.query.type,
  })
    .populate("offerItem")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    banners,
  });
});
export const editBanner = catchAsyncError(async (req, res, next) => {
  const {
    headingOne,
    headingTwo,
    description,
    trialLink,
    enrollLink,
    offerItem,
    offerItemType,
    screenType,
  } = req.body;

  let banner = await Banner.findById(req.params.id);
  if (!banner) return next(new ErrorHandler("Banner not found", 404));

  let _banner = {
    headingOne,
    headingTwo,
    description,
    bannerLinks: {
      trial: trialLink ? trialLink : undefined,
      enroll: enrollLink ? enrollLink : undefined,
    },
    offerItem,
    screenType,
    offerItemType: banner.offerItemType,
  };

  if (offerItem && offerItemType) {
    _banner.offerItemType = offerItemType;
  } else if (!offerItem && !offerItemType) {
    _banner.offerItemType = undefined;
  }
  if (req.files.bannerImage) {
    await deleteFile(
      banner.bannerImg,
      `./public/uploads/banners/${banner.bannerImg}`
    );
    _banner.bannerImg = req.files.bannerImage[0].filename;
  }

  await Banner.findByIdAndUpdate(req.params.id, _banner);

  req.flash("success", "Banner updated successfully.");
  res.redirect("/api/creator/banner/list");
});
export const deleteBanner = catchAsyncError(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);
  if (!banner) return next(new ErrorHandler("Banner not found", 404));

  banner.deleted = true;
  await banner.save();

  req.flash("success", "Banner deleted successfully.");
  res.redirect("/api/creator/banner/list");
});

import jwt from "jsonwebtoken";
import { Creator } from "../models/Creator.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// authorizedCreator
// checkCreatorsModuleAccess

// authorizedAdmin
// checkAdminsModuleAccess

// authorizedLearner
// authorizedSubScriber

export const authorizedAdmin = (req, res, next) => {};
export const checkAdminsModuleAccess = (req, res, next) => {};

export const authorizedCreator = (req, res, next) => {
  if (req.user && req.user.type === "creator") {
    return next();
  }
  req.flash("error", "Please authenticate yourself first!");
  return res.redirect("/api/creator/auth/login");
};
export const checkCreatorsModuleAccess = (moduleName) => {
  return (req, res, next) => {
    if (req.user.role === "creator" || req.user.modules.includes(moduleName)) {
      next();
    } else {
      req.flash("error", "Don't have access to this module!");
      return res.redirect("/api/creator");
    }
  };
};

export const authorizedLearner = (req, res, next) => {};
export const authorizedSubScriber = (req, res, next) => {};

export const extractCreatorInfo = async (req, res, next) => {
  try {
    const brandSlug = req.headers.referer.split("/")[2].split(".")[0];
    const creatorInfo = await Creator.findOne({
      slug: brandSlug,
      deleted: false,
    }).select("_id");

    if (!creatorInfo) return next(new ErrorHandler("Creator not found", 404));

    req.creatorInfo = creatorInfo;
    next();
  } catch (error) {
    console.log(error);
  }
};

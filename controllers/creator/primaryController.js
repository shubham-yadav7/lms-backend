import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Coupon } from "../../models/Coupon.js";
import { Course } from "../../models/Course.js";
import { CourseCategory } from "../../models/CourseCategory.js";
import { Learner } from "../../models/Learner.js";

export const dashboard = catchAsyncError(async (req, res, next) => {

  const [couponCount, courseCount, categoryCount, learnerCount, allCourses] = await Promise.all([
    Coupon.countDocuments(),
    Course.countDocuments(),
    CourseCategory.countDocuments(),
    Learner.countDocuments(),
    Course.find({}),
  ]);

  return res.render("creator/primary/index", {
    couponCount,
    courseCount,
    categoryCount,
    learnerCount,
    allCourses,
    user: req.user,
  });
});

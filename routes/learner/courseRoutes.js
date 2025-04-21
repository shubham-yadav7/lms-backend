import express from "express";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import {
  getAllCourseCategoriesList,
  getAllCourses,
  getAllCoursesList,
  getCourseBySlug,
} from "../../controllers/creator/courseController.js";

const router = express.Router();

router
  .route("/categories/list")
  .get(getAllCourseCategoriesList);

router.route("/list").get(getAllCoursesList);
router.route("/paginate-list").get(getAllCourses);
router.route("/:slug").get(getCourseBySlug);

// router.route("/start-course/:id").get(extractCreatorInfo, getCourseDetails);

export default router;

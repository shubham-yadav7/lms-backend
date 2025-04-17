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
  .get(extractCreatorInfo, getAllCourseCategoriesList);

router.route("/list").get(extractCreatorInfo, getAllCoursesList);
router.route("/paginate-list").get(extractCreatorInfo, getAllCourses);
router.route("/:slug").get(extractCreatorInfo, getCourseBySlug);

// router.route("/start-course/:id").get(extractCreatorInfo, getCourseDetails);

export default router;

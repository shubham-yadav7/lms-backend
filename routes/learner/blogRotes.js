import express from "express";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import {
  blogDetailsBySlug,
  getAllBlog,
  getCategoryBySlug,
  getTagBySlug,
} from "../../controllers/creator/blogController.js";

const router = express.Router();

router.route("/list").get(extractCreatorInfo, getAllBlog);
router.route("/:slug").get(extractCreatorInfo, blogDetailsBySlug);
router.route("/tag/:slug").get(extractCreatorInfo, getTagBySlug);
router.route("/category/:slug").get(extractCreatorInfo, getCategoryBySlug);

export default router;

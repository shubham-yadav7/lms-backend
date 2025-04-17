import express from "express";
import {
  getAllCourseBundles,
  getBundleBySlug,
} from "../../controllers/creator/courseBundleController.js";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";

const router = express.Router();

router.route("/list").get(extractCreatorInfo, getAllCourseBundles);
router.route("/:slug").get(extractCreatorInfo, getBundleBySlug);

export default router;

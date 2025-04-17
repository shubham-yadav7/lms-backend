import express from "express";
import {
  getAllHelp,
  getHelpBySlug,
} from "../../controllers/creator/helpController.js";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";

const router = express.Router();

router.route("/list").get(extractCreatorInfo, getAllHelp);
router.route("/:slug").get(extractCreatorInfo, getHelpBySlug);

export default router;

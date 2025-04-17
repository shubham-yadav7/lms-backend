import express from "express";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import {
  getAllProducts,
  getProductBySlug,
} from "../../controllers/creator/productController.js";

const router = express.Router();

router.route("/list").get(extractCreatorInfo, getAllProducts);
router.route("/:slug").get(extractCreatorInfo, getProductBySlug);

export default router;

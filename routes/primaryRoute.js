import express from "express";
import { catchAsyncError } from "../middleWares/catchAsyncError.js";

const router = express.Router();

router.route("/").get(catchAsyncError(async (req, res, next) => {

    return res.redirect("/api/creator/");
}));

export default router;
import express from "express";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import passport from "passport";
import {
  addToCart,
  fetchCart,
  fetchCoupons,
  removeFromCart
} from "../../controllers/learner/inventoryController.js";

const router = express.Router();

router
  .route("/add-to-cart")
  .post(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    addToCart
  );

router
  .route("/remove-from-cart")
  .post(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    removeFromCart
  );

router
  .route("/cart")
  .get(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    fetchCart
  );

router
  .route("/fetch-coupons")
  .get(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    fetchCoupons
  );

export default router;

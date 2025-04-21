import express from "express";
import passport from "passport";
import {
  addToCart,
  fetchCart,
  fetchCoupons,
  removeFromCart,
  createOrder,
  verifyPayment
} from "../../controllers/learner/inventoryController.js";
import { Cashfree } from "cashfree-pg"; 

const router = express.Router();

router
  .route("/add-to-cart")
  .post(
    passport.authenticate("jwt", { session: false }),
    addToCart
  );

router
  .route("/remove-from-cart")
  .post(
    passport.authenticate("jwt", { session: false }),
    removeFromCart
  );

router
  .route("/cart")
  .get(
    passport.authenticate("jwt", { session: false }),
    fetchCart
  );

router
  .route("/fetch-coupons")
  .get(
    passport.authenticate("jwt", { session: false }),
    fetchCoupons
  );

router
  .route("/create-order")
  .post(

    createOrder
  );
router
  .route("/verify-payment")
  .post(

    verifyPayment
  );
  

export default router;

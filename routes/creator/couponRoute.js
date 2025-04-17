import express from "express";
import {
  addCoupon,
  deleteCoupon,
  editCoupon,
  getAllCoupons,
  getAllDeletedCoupons,
  restoreCoupon,
} from "../../controllers/creator/couponController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("coupon"), addCoupon);

router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("coupon"), getAllCoupons);

router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("coupon"),
    getAllDeletedCoupons
  );

router
  .route("/:id/restore-deleted-coupon")
  .put(authorizedCreator, checkCreatorsModuleAccess("coupon"), restoreCoupon);

router
  .route("/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("coupon"), editCoupon)
  .delete(authorizedCreator, checkCreatorsModuleAccess("coupon"), deleteCoupon);

export default router;

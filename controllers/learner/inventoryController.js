import mongoose from "mongoose";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Cart } from "../../models/Cart.js";
import { CartItem } from "../../models/CartItems.js";
import { Coupon } from "../../models/Coupon.js";
import { Course } from "../../models/Course.js";
import { CourseBundle } from "../../models/CourseBundle.js";
import { Learner } from "../../models/Learner.js";
import { Product } from "../../models/Product.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { Cashfree } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY,
  key_secret: process.env.RZP_SECRET,
});

export const addToCart = catchAsyncError(async (req, res, next) => {
  const { id, type } = req.body;
  // TODO: replace all findById to findOne with creator id or add all conditions in passport middleware

  //  📝 Find learner
  let learner = await Learner.findOne({
    
    _id: req.user,
    deleted: false,
    status: true,
  });
  if (!learner)
    return next(new ErrorHandler("Account is not exists or deactivated.", 401));

  // 📝 check cart is exists or not if not then create and assign to learner
  let cart = await Cart.findOne({
    
    learner: req.user,
  });

  if (!cart) {
    cart = await Cart.create({
      
      learner: req.user,
    });
    await Learner.findByIdAndUpdate(learner._id, { cart: cart._id });
  }

  let isAlreadyInCart = await CartItem.countDocuments({
    cart: cart._id,
    item: id,
  });
  if (isAlreadyInCart > 0) {
    return next(new ErrorHandler(`${type} is already in cart`, 409));
  }

  let _cart = {
    cart: cart._id,
  };

  //  📝 update data for cart item according to item type
  switch (type) {
    case "course": {
      const course = await Course.findById(id);
      if (!course)
        return next(
          new ErrorHandler("Course you looking for is not exists", 404)
        );

      _cart.item = course._id;
      _cart.type = "course";

      break;
    }
    case "product": {
      const product = await Product.findById(id);
      if (!product)
        return next(
          new ErrorHandler("Product you looking for is not exists", 404)
        );

      _cart.item = product._id;
      _cart.type = "product";
      break;
    }
    case "bundle": {
      const bundle = await CourseBundle.findById(id);
      if (!bundle)
        return next(
          new ErrorHandler("Course bundle you looking for is not exists", 404)
        );

      _cart.item = bundle._id;
      _cart.type = "courseBundle";
      break;
    }
  }

  //  📝 create cart item
  await CartItem.create(_cart);
  res.status(200).json({
    success: true,
    message: `${type} added to cart successfully.`,
  });
});

export const removeFromCart = catchAsyncError(async (req, res, next) => {
  let { id: cartId } = req.body;
  await CartItem.findByIdAndDelete(cartId);

  res.status(200).json({
    success: true,
    message: "Item remove from cart.",
  });
});

export const fetchCart = catchAsyncError(async (req, res, next) => {
  const learner = await Learner.findOne({
    
    _id: req.user,
    deleted: false,
    status: true,
  });

  if (!learner) {
    return next(new ErrorHandler("Account not exists or deactivated.", 401));
  }

  let cartItems = [];
  let gst = 0;
  let cartTotal = 0;
  let grandTotal = 0;

  let discountAmount = null;
  let coupon = null;
  let message = null;
  let status = false;

  // fetch all cart items
  if (learner.cart) {
    cartItems = await CartItem.find({
      cart: learner.cart,
    }).populate({
      path: "item",
      select:
        "title slug excerpt description level category price discountedPrice thumbnailVideo thumbnailImage ratings averageRating totalLessons duration level",
    });
  }

  // calculate cart total (🧭UPDATE ON DEMAND)
  let _total = 0;
  // 📝 Always prefer "For of loop" instead of foreach in asynchronous operations.
  for (let { item } of cartItems || []) {
    if (item.discountedPrice) {
      _total += item.discountedPrice;
    } else if (item.price) {
      _total += item.price;
    }
  }

  // update cart total
  await Cart.findByIdAndUpdate(learner.cart, { total: _total });

  // apply coupon ((direct coupon | item wise coupon) => (fixed, percentage))
  if (req.query.coupon) {
    // apply coupon and calculate grand total
    const coupon = await Coupon.findOne({
      _id: req.query.coupon,
      deleted: false,
      status: true,
      expiredAt: {
        $gte: Date.now(),
      },
    });

    if (!coupon) {
      return next(
        new ErrorHandler("Coupon you try to apply is expired or invalid", 422)
      );
    }

    if (coupon.minPurchaseAmount < _total) {
      //  check if coupon is items specific or global
      let isItemSpecificCoupon = coupon.courses.length > 0 || coupon.products.length > 0;

      if (isItemSpecificCoupon) {
        // Coupon going to apply on specific item
        switch (coupon.type) {
          case "percentage": {
            // TODO: create applied coupon schema and store applied coupons details
            let applicableCoursesAndProducts = [
              ...coupon.courses.map((id) => id.toString()),
              ...coupon.products.map((id) => id.toString()),
            ];
            applicableCoursesAndProducts = cartItems.filter(({ item }) =>
              applicableCoursesAndProducts.includes(item._id.toString())
            );

            let itemsPrice = applicableCoursesAndProducts.reduce(
              (accumulator, { item }) => {
                return accumulator + item.discountedPrice;
              },
              0
            );

            // upto and min purchase logic apply and continue further
            discountAmount = (parseFloat(itemsPrice) * parseFloat(coupon.couponValue)) / 100;
            discountAmount = parseFloat(coupon.discountUpTo) < parseFloat(discountAmount) ? coupon.discountUpTo : discountAmount;
            grandTotal = _total - discountAmount;

            break;
          }
          case "fixed": {
            discountAmount = coupon.couponValue;
            grandTotal = _total - discountAmount;
            break;
          }
        }
      } else {
        // Coupon going to apply on cart total
        switch (coupon.type) {
          case "percentage": {
            discountAmount = (parseFloat(_total) * parseFloat(coupon.couponValue)) / 100;
            discountAmount = parseFloat(coupon.discountUpTo) < parseFloat(discountAmount) ? coupon.discountUpTo : discountAmount;

            grandTotal = _total - discountAmount;
            break;
          }
          case "fixed": {
            discountAmount = coupon.couponValue;
            grandTotal = _total - discountAmount;
            break;
          }
        }
      }
    } else {
      message = "Add more items to your cart to use this coupon";
    }
  } else {
    grandTotal = _total;
  }

  res.status(200).json({
    success: true,
    cartItems,
    cartTotal: _total,
    gst,
    grandTotal,
    discountAmount: discountAmount || 0, // 👈 Add this line
    coupon: coupon?._id || null,         // Optional: send back applied coupon info
    message,                             // Optional: send message about coupon min limit
  });
});

export const fetchCoupons = catchAsyncError(async (req, res, next) => {
  // TODO: check all crud operation contains creator or not
  const coupons = await Coupon.find({
    
    expiredAt: { $gt: Date.now() },
    status: true,
    deleted: false,
  });

  // TODO:
  // 1. write condition for first time users

  // 2. write condition to check user already applied coupon and no of uses are valid

  res.status(200).json({
    success: true,
    coupons,
  });
});


export const createOrder = async (req, res) => {
  const { amount, cartItems } = req.body;

  const options = {
    amount: amount,
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ order, cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { response, cartItems } = req.body;
  const learnerId = req.user._id;

  // Ideally verify signature here for security

  for (let courseId of cartItems) {
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { learners: learnerId }, // ensures no duplicates
    });

    await PurchasedItem.create({
      course: courseId,
      learner: learnerId,
    });
  }

  res.status(200).json({ message: "Payment successful and access granted" });
};
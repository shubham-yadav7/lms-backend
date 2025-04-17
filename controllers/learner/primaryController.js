import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Course } from "../../models/Course.js";
import { Product } from "../../models/Product.js";

export const searchInputResult = catchAsyncError(async (req, res, next) => {
  const { query: search } = req.query;

  let _query = {
    creator: req.creatorInfo._id,
    deleted: false,
    status: true,
  };

  let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(newSearchQuery, "gi");

  _query.$or = [
    {
      title: regex,
    },
    {
      excerpt: regex,
    },
    {
      description: regex,
    },
  ];

  const courses = await Course.find(_query);
  const products = await Product.find(_query);

  res.status(200).json({
    success: true,
    courses,
    products,
  });
});

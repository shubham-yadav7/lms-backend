import { catchAsyncError } from "../../middleWares/catchAsyncError.js";

export const dashboard = catchAsyncError((req, res, next) => {
  console.log(req.user, "primary route");
  res.render("creator/primary/index");
});

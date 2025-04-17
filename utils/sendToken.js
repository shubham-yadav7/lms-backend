export const sendToken = (learner, statusCode, res) => {
  const token = learner.getJWTToken();

  // options for cookies
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    learner,
    token,
  });
};

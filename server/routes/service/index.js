const router = require("express").Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/user");
const getUserServices = require("../../helpers/getUserServices");
const asyncHandler = require("../../helpers/asyncHandler");

router.use("/area", require("./area"));

router.get("/", asyncHandler(auth), async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(400).json({ msg: "No user found" });

  const services = await getUserServices(user.services);
  res.json({ services });
});

module.exports = router;

const router = require("express").Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/user");
const Service = require("../../models/service");
const AccountProvider = require("../../models/accountProvider");
const asyncHandler = require("../../helpers/asyncHandler");
const { uniqBy } = require("lodash");

router.use("/auth", require("./auth")["router"]);

router.get("/", asyncHandler(auth), async (req, res) => {
  const user = await User.findById(req.userId);
  const services = await Service.find({ _id: { $in: user.services } });
  const accountProviders = (await Promise.all(
    services.map(service => AccountProvider.findById(service.accountProvider))
  )).filter(Boolean);

  res.json({
    accountProviders: uniqBy(accountProviders, "name").map(accountProvider => ({
      id: accountProvider._id.toString(),
      name: accountProvider.name,
      path: `/accountProvider/auth/${accountProvider.name.toLowerCase()}`,
      connected: !!accountProvider.token
    }))
  });
});

module.exports = router;

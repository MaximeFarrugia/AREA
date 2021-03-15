const User = require("../models/user");
const Service = require("../models/service");
const AccountProvider = require("../models/accountProvider");

const getAccountProvider = async (userId, serviceName) => {
  const user = await User.findById(userId);
  const service = await Service.findOne({
    $and: [{ _id: { $in: user.services } }, { name: serviceName }]
  });
  const provider = await AccountProvider.findById(service.accountProvider);
  return provider;
};

module.exports = getAccountProvider;

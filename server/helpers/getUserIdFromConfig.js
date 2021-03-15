const User = require("../models/user");

const getUserIdFromConfig = async configId => {
  const [user] = await User.aggregate([
    {
      $lookup: {
        from: "configs",
        localField: "areas",
        foreignField: "_id",
        as: "areas"
      }
    },
    {
      $match: {
        "areas._id": configId
      }
    }
  ]);
  return user._id;
};

module.exports = getUserIdFromConfig;

const Service = require("../models/service");

const getUserServices = async servicesId =>
  Service.aggregate([
    { $match: { _id: { $in: servicesId } } },
    {
      $lookup: {
        from: "accountproviders",
        localField: "accountProvider",
        foreignField: "_id",
        as: "accountProvider"
      }
    },
    {
      $match: {
        "accountProvider.token": { $ne: "" }
      }
    },
    {
      $lookup: {
        from: "actions",
        localField: "actions",
        foreignField: "_id",
        as: "actions"
      }
    },
    {
      $lookup: {
        from: "reactions",
        localField: "reactions",
        foreignField: "_id",
        as: "reactions"
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        actions: { _id: 1, name: 1, description: 1, params: 1 },
        reactions: { _id: 1, name: 1, description: 1, params: 1 }
      }
    }
  ]);

module.exports = getUserServices;

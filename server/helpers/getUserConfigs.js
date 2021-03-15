const User = require("../models/user");
const Config = require("../models/config");
const Action = require("../models/action");
const Reaction = require("../models/reaction");
const Service = require("../models/service");
const Param = require("../models/param");

const getUserConfigs = async userId => {
  const { areas } = await User.findById(userId);
  let configs = await Config.find({ _id: { $in: areas } });

  configs = await Promise.all(
    configs.map(async config => {
      const action = {
        service: await Service.findOne({ actions: config.action.action }),
        action: await Action.findById(config.action.action),
        params: await Param.find({ _id: { $in: config.action.params } })
      };
      const reaction = {
        service: await Service.findOne({ reactions: config.reaction.reaction }),
        reaction: await Reaction.findById(config.reaction.reaction),
        params: await Param.find({ _id: { $in: config.reaction.params } })
      };

      return {
        _id: config._id,
        action: {
          ...action,
          params: action.params.reduce(
            (acc, current) => [
              ...acc,
              {
                ...current._doc,
                getOptions: action.action.params.find(
                  p => p.name === current.name
                ).getOptions
              }
            ],
            []
          )
        },
        reaction: {
          ...reaction,
          params: reaction.params.reduce(
            (acc, current) => [
              ...acc,
              {
                ...current._doc,
                getOptions: reaction.reaction.params.find(
                  p => p.name === current.name
                ).getOptions
              }
            ],
            []
          )
        }
      };
    })
  );

  return configs;
};

module.exports = getUserConfigs;

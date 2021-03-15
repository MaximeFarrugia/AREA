const { startNewCronjob, stopCronjob } = require("./cronjobs");
const {
  createTrelloWebhook,
  deleteTrelloWebhook,
  createOutlookWebhook,
  deleteOutlookWebhook
} = require("./webhooks");
const Config = require("../models/config");

const getConfig = async configId => {
  const [config] = await Config.aggregate([
    { $match: { _id: configId } },
    {
      $lookup: {
        from: "actions",
        localField: "action.action",
        foreignField: "_id",
        as: "action.action"
      }
    },
    {
      $lookup: {
        from: "params",
        localField: "action.params",
        foreignField: "_id",
        as: "action.params"
      }
    },
    {
      $lookup: {
        from: "reactions",
        localField: "reaction.reaction",
        foreignField: "_id",
        as: "reaction.reaction"
      }
    },
    {
      $lookup: {
        from: "params",
        localField: "reaction.params",
        foreignField: "_id",
        as: "reaction.params"
      }
    }
  ]);
  return config;
};

const setupNewAction = async ({ configId, userId }) => {
  const fcts = {
    on_cron: startNewCronjob,
    on_new_card: createTrelloWebhook,
    on_card_moved: createTrelloWebhook,
    on_card_updated: createTrelloWebhook,
    on_new_mail_from: createOutlookWebhook,
    on_new_mail_containing: createOutlookWebhook
  };
  const config = await getConfig(configId);
  await fcts[config.action.action[0].name]({ config, userId });
};

const cleanAction = async ({ configId, userId }) => {
  const fcts = {
    on_cron: stopCronjob,
    on_new_card: deleteTrelloWebhook,
    on_card_moved: deleteTrelloWebhook,
    on_card_updated: deleteTrelloWebhook,
    on_new_mail_from: deleteOutlookWebhook,
    on_new_mail_containing: deleteOutlookWebhook
  };
  const config = await getConfig(configId);
  await fcts[config.action.action[0].name]({ config, userId });
};

module.exports = {
  setupNewAction,
  cleanAction,
  getConfig
};

const CronJob = require("cron").CronJob;
const Config = require("../models/config");
const reactionFunctions = require("./reactionFunctions");
const getUserIdFromConfig = require("./getUserIdFromConfig");

global.cronjobs = [];

const startAllCronjobs = async () => {
  const configs = await Config.aggregate([
    {
      $lookup: {
        from: "actions",
        localField: "action.action",
        foreignField: "_id",
        as: "action.action"
      }
    },
    { $match: { "action.action.name": "on_cron" } },
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
  global.cronjobs.forEach(c => c.job.stop());
  configs.forEach(c => startNewCronjob({ config: c }));
};

const startNewCronjob = async ({ config }) => {
  const configId = config._id.toString();
  const existingCronjob = global.cronjobs.find(c => c.configId === configId);
  if (existingCronjob) {
    existingCronjob.job.stop();
    global.cronjobs = global.cronjobs.filter(c => c.configId !== configId);
  }
  const userId = await getUserIdFromConfig(config._id);

  const newCronjob = new CronJob(
    config.action.params[0].value,
    () =>
      reactionFunctions[config.reaction.reaction[0].name](
        userId,
        config.reaction.params
      ),
    null,
    true,
    "Europe/Paris",
    null,
    true
  );
  global.cronjobs = [
    ...global.cronjobs,
    { configId: configId, job: newCronjob }
  ];
};

const stopCronjob = async ({ config }) => {
  const configId = config._id.toString();
  const existingCronjob = global.cronjobs.find(c => c.configId === configId);
  if (!existingCronjob) return;

  existingCronjob.job.stop();
  global.cronjobs = global.cronjobs.filter(c => c.configId !== configId);
};

module.exports = { startAllCronjobs, startNewCronjob, stopCronjob };

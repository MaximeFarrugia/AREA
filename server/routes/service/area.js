const router = require("express").Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/user");
const asyncHandler = require("../../helpers/asyncHandler");
const getUserServices = require("../../helpers/getUserServices");
const paramValidators = require("../../helpers/paramValidators");
const Config = require("../../models/config");
const Param = require("../../models/param");
const getUserConfigs = require("../../helpers/getUserConfigs");
const getParamOptions = require("../../helpers/getParamOtions");
const { setupNewAction, cleanAction } = require("../../helpers/setupAction");

const checkInput = async (req, res, next) => {
  req.user = await User.findById(req.userId);
  if (!req.user) return res.status(400).json({ msg: "User does not exist" });

  req.services = await getUserServices(req.user.services);
  const { action, reaction } = req.body;
  if (
    !action?.service ||
    !action?.action ||
    !action?.params ||
    !reaction?.service ||
    !reaction?.reaction ||
    !reaction?.params
  )
    return res.status(400).json({ msg: "invalid input" });

  req.actionService = req.services.find(
    s => s._id.toString() === action.service
  );
  if (!req.actionService)
    return res
      .status(400)
      .json({ msg: "Cannot use this service as action service" });

  req.action = req.actionService.actions.find(
    a => a._id.toString() === action.action
  );
  if (!req.action)
    return res.status(400).json({ msg: "Cannot use this service action" });

  const actionParamsValidity = await paramValidators[req.action.name](
    req.userId,
    action.params
  );
  if (actionParamsValidity)
    return res.status(400).json({ msg: actionParamsValidity });

  req.reactionService = req.services.find(
    s => s._id.toString() === reaction.service
  );
  if (!req.reactionService)
    return res
      .status(400)
      .json({ msg: "Cannot use this service as reaction service" });

  req.reaction = req.reactionService.reactions.find(
    a => a._id.toString() === reaction.reaction
  );
  if (!req.reaction)
    return res.status(400).json({ msg: "Cannot use this service reaction" });

  const reactionParamsValidity = await paramValidators[req.reaction.name](
    req.userId,
    reaction.params
  );
  if (reactionParamsValidity)
    return res.status(400).json({ msg: reactionParamsValidity });
  next();
};

router.post(
  "/create",
  asyncHandler(auth),
  asyncHandler(checkInput),
  async (req, res) => {
    try {
      const {
        action: { params: actionParams },
        reaction: { params: reactionParams }
      } = req.body;

      const config = await new Config({
        action: {
          action: req.action,
          params: await Promise.all(
            Object.entries(actionParams).map(([key, value]) =>
              new Param({ name: key, value }).save()
            )
          )
        },
        reaction: {
          reaction: req.reaction,
          params: await Promise.all(
            Object.entries(reactionParams).map(([key, value]) =>
              new Param({ name: key, value }).save()
            )
          )
        }
      }).save();
      req.user.areas.push(config);
      await req.user.save();
      await setupNewAction({ configId: config._id, userId: req.userId });
      res.status(200).json({ config });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

router.post(
  "/update",
  asyncHandler(auth),
  asyncHandler(checkInput),
  async (req, res) => {
    try {
      const {
        action: { params: actionParams },
        reaction: { params: reactionParams },
        configId
      } = req.body;

      if (!configId) return res.status(400).json({ msg: "configId required" });
      const config = await Config.findById(configId);
      if (!config || !req.user.areas?.find(c => c._id.toString() === configId))
        return res.status(400).json({ msg: "invalid configId" });

      await cleanAction({ configId: config._id, userId: req.userId });
      await Param.deleteMany({
        _id: {
          $in: [
            ...config.action.params.map(p => p._id),
            ...config.reaction.params.map(p => p._id)
          ]
        }
      });
      config.action = {
        action: req.action,
        params: await Promise.all(
          Object.entries(actionParams).map(([key, value]) =>
            new Param({ name: key, value }).save()
          )
        )
      };
      config.reaction = {
        reaction: req.reaction,
        params: await Promise.all(
          Object.entries(reactionParams).map(([key, value]) =>
            new Param({ name: key, value }).save()
          )
        )
      };
      const savedConfig = await config.save();
      await req.user.save();
      await setupNewAction({ configId: config._id, userId: req.userId });
      res.status(200).json({ config: savedConfig });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

router.post("/delete", asyncHandler(auth), async (req, res) => {
  try {
    const { configId } = req.body;

    if (!configId) return res.status(400).json({ msg: "configId required" });
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    const config = await Config.findById(configId);
    if (!config || !user.areas?.find(c => c._id.toString() === configId))
      return res.status(400).json({ msg: "invalid configId" });

    await cleanAction({ configId: config._id, userId: req.userId });
    await Param.deleteMany({
      _id: {
        $in: [
          ...config.action.params.map(p => p._id),
          ...config.reaction.params.map(p => p._id)
        ]
      }
    });
    await Config.deleteOne({ _id: configId });
    user.areas = user.areas.filter(a => a.toString() !== configId);
    await user.save();
    res.status(200).json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/configs", asyncHandler(auth), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const configs = await getUserConfigs(user._id);
    res.status(200).json({ configs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/getParamOptions", asyncHandler(auth), async (req, res) => {
  try {
    const {
      service: serviceName,
      param: requestedParam,
      ...queries
    } = req.query;
    if (!serviceName || !requestedParam)
      return res
        .status(400)
        .json({ msg: "Missing service or param in query string" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const options = await getParamOptions({
      service: serviceName,
      param: requestedParam,
      data: {
        ...queries,
        userId: user._id
      }
    });
    res.status(200).json({ options });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

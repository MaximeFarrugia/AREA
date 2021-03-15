const router = require("express").Router();
const ObjectId = require("mongoose").Types.ObjectId;
const actionFunctions = require("../../helpers/actionFunctions");
const reactionFunctions = require("../../helpers/reactionFunctions");
const getUserIdFromConfig = require("../../helpers/getUserIdFromConfig");
const { getConfig } = require("../../helpers/setupAction");

router.post("/", async (req, res) => {
  try {
    const { configId, validationToken } = req.query;
    if (validationToken) return res.status(200).send(validationToken);
    if (!configId) return res.status(400).json({ msg: "configId is required" });

    const config = await getConfig(ObjectId(configId));
    const {
      action: {
        params: actionParams,
        action: [{ name: actionName }]
      },
      reaction: {
        params: reactionParams,
        reaction: [{ name: reactionName }]
      }
    } = config;
    const userId = ObjectId(await getUserIdFromConfig(config._id));
    if (
      await actionFunctions[actionName]({
        data: req.body,
        userId,
        params: actionParams
      })
    ) {
      await reactionFunctions[reactionName](userId, reactionParams);
    }
    res.status(200).json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", (req, res) => res.status(200).json(true))

module.exports = router;

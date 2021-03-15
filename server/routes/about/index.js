const router = require("express").Router();
const { uniqBy } = require("lodash");
const Service = require("../../models/service");
const Action = require("../../models/action");
const Reaction = require("../../models/reaction");
const createUserServices = require("../../helpers/createUserServices");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const existingServices = await Service.find({});
  const services = await Promise.all(
    uniqBy(
      existingServices.length ? existingServices : await createUserServices(),
      "name"
    ).map(async s => ({
      name: s.name,
      actions: (await Action.find({ _id: { $in: s.actions } })).map(a => ({
        name: a.name,
        description: a.description
      })),
      reactions: (await Reaction.find({ _id: { $in: s.reactions } })).map(
        r => ({
          name: r.name,
          description: r.description
        })
      )
    }))
  );
  const about = {
    client: {
      host: ip
    },
    server: {
      current_time: +new Date(),
      services
    }
  };
  res.send(JSON.stringify(about));
});

module.exports = router;

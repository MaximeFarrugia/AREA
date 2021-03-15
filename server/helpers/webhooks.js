const Trello = require("trello");
const axios = require("axios");
const { stringify } = require("querystring");
const getAccountProvider = require("./getAccountProvider");
const getUserConfigs = require("./getUserConfigs");
const graph = require("@microsoft/microsoft-graph-client");
const microsoftAuthProvider = require("./microsoftAuthProvider");
require("isomorphic-fetch");

const createTrelloWebhook = async ({ config, userId }) => {
  const provider = await getAccountProvider(userId, "Trello");
  const trello = new Trello(process.env.TRELLO_KEY, provider.token);
  const {
    action: { params }
  } = config;
  const boardId = params.find(p => p.name === "board")?.value || "";
  await trello.addWebhook(
    "AREA",
    `${global.tunnel}/webhookCallbacks?configId=${config._id.toString()}`,
    boardId
  );
};

const deleteTrelloWebhook = async ({ config, userId }) => {
  const provider = await getAccountProvider(userId, "Trello");
  const trello = new Trello(process.env.TRELLO_KEY, provider.token);
  const { data: webhooks } = await axios.get(
    `https://api.trello.com/1/tokens/${provider.token}/webhooks?key=${process.env.TRELLO_KEY}`
  );
  const {
    action: { params }
  } = config;
  const boardId = params.find(p => p.name === "board")?.value || "";
  const configs = (await getUserConfigs(userId))
    .filter(c => c._id.toString() !== config._id.toString())
    .filter(c => c.action.service.name === "Trello")
    .filter(
      c => c.action.params.find(p => p.name === "board")?.value === boardId
    );
  if (configs.length) return;
  const webhook = webhooks.find(w =>
    w.callbackURL.includes(`configId=${config._id.toString()}`)
  );
  if (!webhook) return;
  await trello.deleteWebhook(webhook.id);
};

const createOutlookWebhook = async ({ config, userId }) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const expirationDateTime = new Date();
    expirationDateTime.setMinutes(expirationDateTime.getMinutes() + 4230);
    await client.api("/subscriptions").post({
      changeType: "created",
      notificationUrl: `${
        global.tunnel
      }/webhookCallbacks?configId=${config._id.toString()}`,
      resource: "/me/messages",
      expirationDateTime
    });
  } catch (err) {
    console.log(err.message);
  }
};

const deleteOutlookWebhook = async ({ config, userId }) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { value: subscriptions } = await client.api("/subscriptions").get();
    const subscription = subscriptions.find(s =>
      s.notificationUrl.includes(`configId=${config._id.toString()}`)
    );
    if (!subscription) return;
    await client.api(`/subscriptions/${subscription.id}`).delete();
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  createTrelloWebhook,
  deleteTrelloWebhook,
  createOutlookWebhook,
  deleteOutlookWebhook
};

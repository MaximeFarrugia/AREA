const graph = require("@microsoft/microsoft-graph-client");
const microsoftAuthProvider = require("./microsoftAuthProvider");
require("isomorphic-fetch");

const on_new_card = async ({ data }) => {
  const {
    action: {
      display: { translationKey }
    }
  } = data;
  return translationKey === "action_create_card";
};

const on_card_moved = async ({ data }) => {
  const {
    action: {
      display: { translationKey }
    }
  } = data;
  return translationKey === "action_move_card_from_list_to_list";
};

const on_card_updated = async ({ data }) => {
  const {
    action: {
      type,
      display: { translationKey }
    }
  } = data;
  return (
    type === "updateCard" &&
    translationKey !== "action_move_card_from_list_to_list"
  );
};

const on_new_mail_from = async ({ data, userId, params }) => {
  try {
    const {
      value: [{ resource }]
    } = data;
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const {
      sender: {
        emailAddress: { address }
      }
    } = await client.api(resource).get();
    const { email } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    return address === email;
  } catch (err) {
    return false;
  }
};

const on_new_mail_containing = async ({ data, userId, params }) => {
  try {
    const {
      value: [{ resource }]
    } = data;
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { subject } = await client.api(resource).get();
    const { data: object } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    return subject.includes(object);
  } catch (err) {
    return false;
  }
};

module.exports = {
  on_new_card,
  on_card_moved,
  on_card_updated,
  on_new_mail_from,
  on_new_mail_containing
};

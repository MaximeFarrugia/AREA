const Trello = require("trello");
const axios = require("axios");
const getAccountProvider = require("./getAccountProvider");
const graph = require("@microsoft/microsoft-graph-client");
const microsoftAuthProvider = require("./microsoftAuthProvider");
require("isomorphic-fetch");

const new_card = async (userId, params) => {
  try {
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return [];

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const { column, title, description } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    await trello.addCard(title, description, column);
  } catch (err) {
    console.log(err.message);
  }
};

const update_card = async (userId, params) => {
  try {
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return [];

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const { board, card, column, title, description } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    const { idList, desc, name } = await trello.getCard(board, card);
    if (name !== title) await trello.updateCardName(card, title);
    if (desc !== description)
      await trello.updateCardDescription(card, description);
    if (idList !== column) await trello.updateCardList(card, column);
  } catch (err) {
    console.log(err.message);
  }
};

const new_group_message = async (userId, params) => {
  try {
    const token = await new microsoftAuthProvider(
      userId,
      "Yammer"
    ).getAccessToken();
    if (!token) return [];

    const { group, message } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    await axios.post(
      "https://api.yammer.com/api/v1/messages.json",
      {
        body: message,
        group_id: group
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "yammer-capabilities": "external-messaging,external-groups"
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};

const add_user_to_group = async (userId, params) => {
  try {
    const token = await new microsoftAuthProvider(
      userId,
      "Yammer"
    ).getAccessToken();
    if (!token) return [];

    const { group, email } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    await axios.post(
      "https://api.yammer.com/api/v1/group_memberships.json",
      {
        email,
        group_id: group
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};

const send_message = async (userId, params) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { team, channel, message } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    await client.api(`/teams/${team}/channels/${channel}/messages`).post({
      body: {
        contentType: "Text",
        content: message
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

const send_mail_to = async (userId, params) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { email, object, data } = params.reduce(
      (acc, current) => ({ ...acc, [current.name]: current.value }),
      {}
    );
    await client.api("/me/sendMail").post({
      message: {
        subject: object,
        body: {
          contentType: "Text",
          content: data
        },
        toRecipients: [
          {
            emailAddress: {
              address: email
            }
          }
        ]
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  new_card,
  update_card,
  new_group_message,
  add_user_to_group,
  send_message,
  send_mail_to
};

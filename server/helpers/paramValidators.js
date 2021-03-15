const parser = require("cron-parser");
const Trello = require("trello");
const axios = require("axios");
const getAccountProvider = require("./getAccountProvider");

const checkTrelloParams = async (userId, params) => {
  try {
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return "not connected to trello";

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const {
      data: { id }
    } = await axios.get(
      `https://api.trello.com/1/members/me?token=${provider.token}&key=${process.env.TRELLO_KEY}`
    );
    const boards = await trello.getBoards(id);
    const { board, column = "", card = "" } = params;
    if (!boards?.find(b => b.id === board)) return "board not found";
    if (column) {
      const columns = await trello.getListsOnBoard(board);
      if (!columns?.find(c => c.id === column)) return "column not found";
    }
    if (card) {
      const cards = await trello.getCardsOnBoard(board);
      if (!cards?.find(c => c.id === card)) return "card not found";
    }
    return "";
  } catch (err) {
    return err.message;
  }
};

const paramValidators = {
  on_cron: async (userId, params) => {
    try {
      if (!params.cron_expression)
        return "on cron: cron expression is required";
      const res = parser.parseExpression(params.cron_expression);
      if (!res) return "on cron: Invalid cron expression";
      return "";
    } catch {
      return "on cron: Invalid cron expression";
    }
  },
  on_new_card: async (userId, params) => {
    if (!params.board) return "on new card: board is required";

    const error = await checkTrelloParams(userId, params);
    return error ? `on new card: ${error}` : "";
  },
  on_card_moved: async (userId, params) => {
    if (!params.board) return "on card moved: board is required";

    const error = await checkTrelloParams(userId, params);
    return error ? `on card updated: ${error}` : "";
  },
  on_card_updated: async (userId, params) => {
    if (!params.board) return "on card moved: board is required";

    const error = await checkTrelloParams(userId, params);
    return error ? `on card moved: ${error}` : "";
  },
  new_card: async (userId, params) => {
    if (!params.board) return "new card: board is required";
    if (!params.column) return "new card: column is required";
    if (!params.title) return "new card: title is required";
    if (!params.description) return "new card: description is required";

    const error = await checkTrelloParams(userId, params);
    return error ? `new card: ${error}` : "";
  },
  update_card: async (userId, params) => {
    if (!params.board) return "update card: board is required";
    if (!params.card) return "update card: card is required";
    if (!params.title) return "update card: title is required";
    if (!params.description) return "update card: description is required";
    if (!params.column) return "update card: column is required";

    const error = await checkTrelloParams(userId, params);
    return error ? `update card: ${error}` : "";
  },
  new_group_message: async (userId, params) => {
    if (!params.group) return "new group message: group is required";
    if (!params.message) return "new group message: message is required";
    return "";
  },
  add_user_to_group: async (userId, params) => {
    if (!params.group) return "add user to group: group is required";
    if (!params.email) return "add user to group: email is required";
    return "";
  },
  send_message: async (userId, params) => {
    if (!params.team) return "send message: team is required";
    if (!params.channel) return "send message: channel is required";
    if (!params.message) return "send message: message is required";
    return "";
  },
  on_new_mail_from: async (userId, params) => {
    if (!params.email) return "on new mail from: email is required";
    return "";
  },
  on_new_mail_containing: async (userId, params) => {
    if (!params.data) return "on new mail containing: data is required";
    return "";
  },
  send_mail_to: async (userId, params) => {
    if (!params.email) return "send mail to: email is required";
    if (!params.object) return "send mail to: object is required";
    if (!params.data) return "send mail to: data is required";
    return "";
  }
};

module.exports = paramValidators;

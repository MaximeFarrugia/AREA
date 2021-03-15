const Trello = require("trello");
const axios = require("axios");
const getAccountProvider = require("./getAccountProvider");
const graph = require("@microsoft/microsoft-graph-client");
const microsoftAuthProvider = require("./microsoftAuthProvider");
require("isomorphic-fetch");

const getTrelloBoards = async ({ userId }) => {
  try {
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return [];

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const {
      data: { id }
    } = await axios.get(
      `https://api.trello.com/1/members/me?token=${provider.token}&key=${process.env.TRELLO_KEY}`
    );
    const boards = await trello.getBoards(id);
    return boards.map(b => ({ label: b.name, value: b.id }));
  } catch {
    return [];
  }
};

const getTrelloColumns = async ({ userId, board }) => {
  try {
    if (!board) return [];
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return [];

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const columns = await trello.getListsOnBoard(board);
    return columns.map(c => ({ label: c.name, value: c.id }));
  } catch {
    return [];
  }
};

const getTrelloCards = async ({ userId, board }) => {
  try {
    if (!board) return [];
    const provider = await getAccountProvider(userId, "Trello");
    if (!provider?.token) return [];

    const trello = new Trello(process.env.TRELLO_KEY, provider.token);
    const cards = await trello.getCardsOnBoard(board);
    return cards.map(c => ({ label: c.name, value: c.id }));
  } catch {
    return [];
  }
};

const getYammerGroups = async ({ userId }) => {
  try {
    const token = await new microsoftAuthProvider(
      userId,
      "Yammer"
    ).getAccessToken();
    if (!token) return [];

    const {
      data: { id }
    } = await axios.get("https://api.yammer.com/api/v1/users/current.json", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data: groups } = await axios.get(
      `https://api.yammer.com/api/v1/groups/for_user/${id}.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return groups.map(g => ({ label: g.full_name, value: g.id }));
  } catch {
    return [];
  }
};

const getTeamsTeams = async ({ userId }) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { value: teams } = await client.api("/me/joinedTeams").get();
    return teams.map(t => ({ label: t.displayName, value: t.id }));
  } catch {
    return [];
  }
};

const getTeamChannels = async ({ userId, team }) => {
  try {
    const client = graph.Client.initWithMiddleware({
      authProvider: new microsoftAuthProvider(userId, "MicrosoftGraph")
    });
    const { value: channels } = await client
      .api(`/teams/${team}/channels`)
      .get();
    return channels.map(c => ({ label: c.displayName, value: c.id }));
  } catch {
    return [];
  }
};

const getParamOptions = ({ service, param, data = {} }) => {
  const fcts = {
    Trello: {
      board: getTrelloBoards,
      column: getTrelloColumns,
      card: getTrelloCards
    },
    Yammer: {
      group: getYammerGroups
    },
    Teams: {
      team: getTeamsTeams,
      channel: getTeamChannels
    }
  };

  const { userId } = data;
  if (!fcts[service] || !fcts[service][param] || !userId) return [];
  return fcts[service][param](data);
};

module.exports = getParamOptions;

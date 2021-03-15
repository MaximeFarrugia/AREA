const AccountProvider = require("../models/accountProvider");
const Service = require("../models/service");
const Action = require("../models/action");
const Reaction = require("../models/reaction");

const createUserServices = async () => {
  const servicesDetails = [
    {
      name: "Cron",
      accountProvider: null,
      actions: [
        {
          name: "on_cron",
          description: "Trigger on specified cron",
          params: [{ name: "cron_expression" }]
        }
      ],
      reactions: []
    },
    {
      name: "Trello",
      accountProvider: "Trello",
      actions: [
        {
          name: "on_new_card",
          description: "Trigger on new card created",
          params: [
            {
              name: "board",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=board"
            }
          ]
        },
        {
          name: "on_card_moved",
          description: "Trigger on card moved",
          params: [
            {
              name: "board",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=board"
            }
          ]
        },
        {
          name: "on_card_updated",
          description: "Trigger on card updated",
          params: [
            {
              name: "board",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=board"
            }
          ]
        }
      ],
      reactions: [
        {
          name: "new_card",
          description: "Create a new card",
          params: [
            {
              name: "board",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=board"
            },
            {
              name: "column",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=column"
            },
            { name: "title" },
            { name: "description" }
          ]
        },
        {
          name: "update_card",
          description: "Update specified card",
          params: [
            {
              name: "board",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=board"
            },
            {
              name: "card",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=card"
            },
            {
              name: "column",
              getOptions:
                "/service/area/getParamOptions?service=Trello&param=column"
            },
            { name: "title" },
            { name: "description" }
          ]
        }
      ]
    },
    {
      name: "Yammer",
      accountProvider: "Yammer",
      actions: [],
      reactions: [
        {
          name: "new_group_message",
          description: "Send a message in specified group",
          params: [
            {
              name: "group",
              getOptions:
                "/service/area/getParamOptions?service=Yammer&param=group"
            },
            { name: "message" }
          ]
        },
        {
          name: "add_user_to_group",
          description: "Add a user in specified group",
          params: [
            {
              name: "group",
              getOptions:
                "/service/area/getParamOptions?service=Yammer&param=group"
            },
            { name: "email" }
          ]
        }
      ]
    },
    {
      name: "Teams",
      accountProvider: "MicrosoftGraph",
      actions: [],
      reactions: [
        {
          name: "send_message",
          description: "Send a message in specified teams channel",
          params: [
            {
              name: "team",
              getOptions:
                "/service/area/getParamOptions?service=Teams&param=team"
            },
            {
              name: "channel",
              getOptions:
                "/service/area/getParamOptions?service=Teams&param=channel"
            },
            { name: "message" }
          ]
        }
      ]
    },
    {
      name: "Outlook",
      accountProvider: "MicrosoftGraph",
      actions: [
        {
          name: "on_new_mail_from",
          description: "Trigger on new mail received from specified email",
          params: [{ name: "email" }]
        },
        {
          name: "on_new_mail_containing",
          description:
            "Trigger on new mail received with object containing specified data",
          params: [{ name: "data" }]
        }
      ],
      reactions: [
        {
          name: "send_mail_to",
          description: "Send email to specified email",
          params: [{ name: "email" }, { name: "object" }, { name: "data" }]
        }
      ]
    }
  ];
  const accountProviders = await Promise.all(
    ["Trello", "MicrosoftGraph", "Yammer"].map(accountProvider => {
      const ap = new AccountProvider({
        name: accountProvider,
        token: "",
        refreshToken: ""
      });
      return ap.save();
    })
  );

  const services = await Promise.all(
    servicesDetails.map(async service => {
      const actions = await Promise.all(
        service.actions.map(a => new Action(a).save())
      );
      const reactions = await Promise.all(
        service.reactions.map(r => new Reaction(r).save())
      );
      const s = new Service({
        name: service.name,
        accountProvider: accountProviders.find(
          ap => ap.name === service.accountProvider
        ),
        actions,
        reactions
      });
      return s.save();
    })
  );
  return services;
};

module.exports = createUserServices;

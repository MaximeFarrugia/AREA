const router = require("express").Router();
const passport = require("passport");
const { Strategy: TrelloStrategy } = require("passport-trello");
const { Strategy: OfficeStrategy } = require("passport-azure-ad-oauth2");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");
const User = require("../../models/user");
const Service = require("../../models/service");
const AccountProvider = require("../../models/accountProvider");
const asyncHandler = require("../../helpers/asyncHandler");
const { uniqBy } = require("lodash");

let resData = {};
const officeScopes = [
  "offline_access",
  "User.Read",
  "Mail.Read",
  "Mail.Send",
  "https://api.yammer.com/user_impersonation",
  "ChatMessage.Read",
  "ChatMessage.Send",
  "Team.ReadBasic.All",
  "TeamsTab.ReadWriteForUser",
  "Channel.ReadBasic.All"
];

passport.serializeUser((profile, done) => done(null, profile));

passport.deserializeUser((profile, done) => done(null, profile));

passport.use(
  "trello",
  new TrelloStrategy(
    {
      consumerKey: process.env.TRELLO_KEY,
      consumerSecret: process.env.TRELLO_SECRET,
      callbackURL: "http://localhost:8080/accountProvider/auth/trello/callback",
      passReqToCallback: true,
      trelloParams: {
        scope: "read,write",
        name: "AREA",
        expiration: "never"
      }
    },
    (req, token, tokenSecret, profile, done) => {
      resData = {
        ...resData,
        token,
        refreshToken: ""
      };
      return done(null, profile);
    }
  )
);

passport.use(
  "office",
  new OfficeStrategy(
    {
      clientID: process.env.OFFICE_KEY,
      clientSecret: process.env.OFFICE_SECRET,
      callbackURL: "http://localhost:8080/accountProvider/auth/office/callback",
      scope: officeScopes
    },
    (accessToken, refresh_token, params, profile, done) => {
      resData = {
        ...resData,
        token: accessToken,
        refreshToken: refresh_token
      };
      return done(null, profile);
    }
  )
);

router.get(
  "/trello",
  (req, res, next) => {
    resData.name = "Trello";
    next();
  },
  passport.authenticate("trello", { session: true })
);

router.get(
  "/trello/callback",
  passport.authenticate("trello", {
    failureRedirect: process.env.FRONTEND_URL
  }),
  (req, res) => {
    const data = jwt.sign(resData, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL}/settings?data=${data}`);
  }
);

router.get(
  "/microsoftgraph",
  (req, res, next) => {
    resData.name = "MicrosoftGraph";
    next();
  },
  passport.authenticate("office", {
    session: true,
    resource: "https://graph.microsoft.com"
  })
);

router.get(
  "/yammer",
  (req, res, next) => {
    resData.name = "Yammer";
    next();
  },
  passport.authenticate("office", {
    session: true,
    resource: "https://api.yammer.com"
  })
);

router.get(
  "/office/callback",
  passport.authenticate("office", {
    failureRedirect: process.env.FRONTEND_URL
  }),
  (req, res) => {
    const data = jwt.sign(resData, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL}/settings?data=${data}`);
  }
);

router.post("/save", asyncHandler(auth), async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) return res.status(400).json({ msg: "Invalid data." });
    const decoded = jwt.verify(data, process.env.JWT_SECRET);
    if (!decoded) return res.status(400).json({ msg: "Invalid data." });

    const { name, token, refreshToken } = decoded;
    const user = await User.findById(req.userId);
    const userServices = await Service.find({ _id: { $in: user.services } });
    const accountProviders = uniqBy(
      (await Promise.all(
        userServices.map(s => AccountProvider.findById(s.accountProvider))
      )).filter(Boolean),
      "name"
    );
    if (!name || !accountProviders.find(s => s.name === name) || !token)
      return res.status(400).json({ msg: "Invalid data." });
    const accountProvider = await AccountProvider.findById(
      accountProviders.find(s => s.name === name)._id
    );
    if (!accountProvider) return res.status(400).json({ msg: "Invalid data." });

    accountProvider.token = token;
    accountProvider.refreshToken = refreshToken;
    await accountProvider.save();
    res.status(200).json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/disconnect", asyncHandler(auth), async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(req.userId);
    const userServices = await Service.find({ _id: { $in: user.services } });
    const accountProviders = uniqBy(
      (await Promise.all(
        userServices.map(s => AccountProvider.findById(s.accountProvider))
      )).filter(Boolean),
      "name"
    ).map(({ _id }) => _id.toString());
    if (!id || !accountProviders.includes(id))
      return res.status(400).json({ msg: "Invalid data." });
    const accountProvider = await AccountProvider.findById(id);
    if (!accountProvider) return res.status(400).json({ msg: "Invalid data." });
    accountProvider.token = "";
    accountProvider.refreshToken = "";
    await accountProvider.save();
    res.status(200).json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = { router, officeScopes };

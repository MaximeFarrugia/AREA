const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const localtunnel = require("localtunnel");
const { startAllCronjobs } = require("./helpers/cronjobs");

(async () => {
  const tunnel = await localtunnel({
    port: 8080,
    subdomain: "maximefarrugia-area"
  });

  global.tunnel = tunnel.url;

  tunnel.on("close", () => {
    console.log(`tunnel closed: ${tunnel.url}`);
  });
})();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: "yes" }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

console.log("Connecting to MongoDB...");
mongoose.connect(
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DB}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw new Error(err);
    else console.log("MongoDB: OK");
  }
);

app.use("/about.json", require("./routes/about"));
app.use("/user", require("./routes/user"));
app.use("/service", require("./routes/service"));
app.use("/accountProvider", require("./routes/accountProvider"));
app.use("/webhookCallbacks", require("./routes/webhookCallbacks"));

startAllCronjobs();

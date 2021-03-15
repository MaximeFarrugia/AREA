const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return res.status(401).json({ msg: "Authorization denied." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({ msg: "Authorization denied." });

    const user = await User.findById(verified.id);
    if (!user) return res.status(401).json({ msg: "Authorization denied." });

    req.userId = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;

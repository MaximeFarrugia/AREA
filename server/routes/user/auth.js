const router = require("express").Router();
const User = require("../../models/user");
const Service = require("../../models/service");
const jwt = require("jsonwebtoken");
const { hashPassword, checkPassword } = require("../../helpers/password");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_ID);
const createUserServices = require('../../helpers/createUserServices')

router.post("/googlelogin", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_ID
    });
    const { email_verified, email } = response.payload;

    if (email_verified) {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
      } else {
        const password = await hashPassword(
          email
            .split("")
            .reverse()
            .join("")
        );
        const services = await createUserServices();
        const newUser = new User({
          email,
          password,
          services,
          areas: [],
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
        res.json({ token });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const passwordHash = await hashPassword(password);
    const services = await createUserServices();
    const newUser = new User({
      email,
      password: passwordHash,
      services,
      areas: [],
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/authenticated", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

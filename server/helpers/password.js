const bcrypt = require("bcryptjs")

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password, salt)
  return passwordHash
}

const checkPassword = async (d1, d2) => {
  const res = await bcrypt.compare(d1, d2)
  return res
}

module.exports = { hashPassword, checkPassword }
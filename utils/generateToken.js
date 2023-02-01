const jwt = require("jsonwebtoken");

const generateTokens = (payload) => {
  const { id, name } = payload;
  const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "48h",
  });

  return token;
};

module.exports = generateTokens;

const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Invalid JWT Token");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    // req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(403).send(error.message);
  }
};

module.exports = {
  verifyToken,
};

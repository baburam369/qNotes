const jwt = require("jsonwebtoken");
const JWT_SECRET = "thi$issecure";

const fetchuser = (req, res, next) => {
  // Get the user from the JWT token and add it to the req object
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Token invalid" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log("User from token:", data.user);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
};

module.exports = fetchuser;

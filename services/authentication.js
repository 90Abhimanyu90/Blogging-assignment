const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    "mysecretkey",   // env variable use karna production me
    { expiresIn: "1h" }
  );
}

function validateToken(token) {
  return jwt.verify(token, "mysecretkey");
}

module.exports = {
  createToken,
  validateToken,
};

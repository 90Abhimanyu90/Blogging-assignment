const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    console.log("Incoming token from cookie:", tokenCookieValue);

    if (!tokenCookieValue) {
      req.user = null;
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      console.error("Invalid Token:", error.message);
      req.user = null;
    }

    next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};

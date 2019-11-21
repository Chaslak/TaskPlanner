const jwt = require("jsonwebtoken");
const secret = "frenchfriestastegood!";
const authEndpoints = function() {
  const protectEndpoints = function(req, res, next) {
    let token = req.headers["authorization"];

    if (token) {
      try {
        let legit = jwt.verify(token, secret);
        console.log(legit);
        next();
      } catch (err) {
        res.status(403).json({ msg: "Not a valid token" });
      }
    } else {
      res.status(403).json({ msg: "No token" });
    }
  };

  return {
    protectEndpoints: protectEndpoints
  };
};

module.exports = authEndpoints;

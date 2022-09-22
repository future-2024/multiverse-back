const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {

    
    let token = req.get("authorization");
    console.log(token);
    //console.warn(token);
    //console.warn(process.env.JWT_SECRET_KEY);
    if (token) {
      // Remove Bearer from string

      token = token.slice(7);
      //console.warn(token);
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};

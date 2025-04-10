const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log("create Access token error");
    return null;
  }
};

const createRefreshToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "30d" }
    );
  } catch (err) {
    console.log("create Access token error");
    return null;
  }
};

module.exports = { createAccessToken, createRefreshToken };

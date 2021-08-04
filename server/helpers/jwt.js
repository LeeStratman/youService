const jwt = require("jsonwebtoken");

const accessJWTSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
const refreshJWTSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const accessJWTExp = process.env.PORT;
const refreshJWTExp = process.env.REFRESH_TOKEN_EXPIRES_IN;

const createAccessToken = function (_id, email) {
  return new Promise(async (resolve, reject) => {
    try {
      const accessJWT = await jwt.sign({ _id, email }, accessJWTSecretKey, {
        expiresIn: accessJWTExp,
      });

      resolve(accessJWT);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createAccessToken,
};

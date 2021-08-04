const jwt = require("jsonwebtoken");

const accessJWTSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
const refreshJWTSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const accessJWTExp = process.env.PORT;
const refreshJWTExp = process.env.REFRESH_TOKEN_EXPIRES_IN;

const createAccessToken = (_id, email) => {
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

const createRfreshToken = (_id, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refreshJWT = await jwt.sign({ _id, email }, refreshJWTSecretKey, {
        expiresIn: refreshJWTExp,
      });

      resolve(refreshJWT);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createAccessToken,
  createRfreshToken,
};

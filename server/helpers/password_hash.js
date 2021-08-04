const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS) || 15;

const hashPassword = (password) => {
  return new Promise((resolve) => {
    const hashedPwd = bcrypt.hashSync(password, saltRounds);
    resolve(hashedPwd);
  });
};

const comparePassword = (pwdFromReqBody, pwdFromDB) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwdFromDB, pwdFromReqBody, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
};

module.exports = {
  hashPassword,
  comparePassword,
};

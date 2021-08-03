const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS) || 15;

const hashPassword = (password) => {
  return new Promise((resolve) => {
    const hashedPwd = bcrypt.hashSync(password, saltRounds);
    resolve(hashedPwd);
  });
};

module.exports = {
  hashPassword,
};

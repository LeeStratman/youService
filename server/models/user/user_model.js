const User = require("./user_schema");

const verifyUser = ({ email, user_id: _id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findOneAndUpdate(
        { email, _id, is_verified: false },
        { $set: { is_verified: true } },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  verifyUser,
};

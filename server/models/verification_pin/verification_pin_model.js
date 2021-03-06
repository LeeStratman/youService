const VerificationPin = require("./verification_pin_schema");
const { sendMessage } = require("../../helpers/twilio_api");
const randomNumGenerator = require("../../helpers/random_num_gen");
const pinLength = process.env.VERIIFICATION_PIN_LENGTH;

// generate verificatiion code
const generateVerificationPin = ({ email, name, phone, _id: user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pin = randomNumGenerator(pinLength);

      //send verification code
      sendMessage(
        `Hi ${name},\nHere is your verification code:\n\n${pin}`,
        phone
      );

      await VerificationPin({ email, pin, user_id })
        .save()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

const verifyPin = (email, pin) => {
  return new Promise(async (resolve, reject) => {
    try {
      await VerificationPin.findOne({ email, pin }, (err, res) => {
        err && reject(false);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteVerificationPin = async (email, pin) => {
  try {
    await VerificationPin.findOneAndDelete({ email, pin }, (error) => {
      error && console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateVerificationPin,
  verifyPin,
  deleteVerificationPin,
};

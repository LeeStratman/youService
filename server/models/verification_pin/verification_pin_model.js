const VerificationPin = require("./verification_pin_schema");
const { sendMessage } = require("../../helpers/twilio_api");
const randomNumGenerator = require("../../helpers/random_num_gen");
const pinLength = process.env.VERIIFICATION_PIN_LENGTH;

// generate verificatiion code
const generateVerificationPin = ({ email, name, phone }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pin = randomNumGenerator(pinLength);

      //send verification code
      sendMessage(
        `Hi ${name},\nHere is your verification code:\n\n${pin}`,
        phone
      );

      await VerificationPin({ email, pin })
        .save()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = {
  generateVerificationPin,
};

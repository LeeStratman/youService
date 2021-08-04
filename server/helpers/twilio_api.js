const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TRIAL_PHONE_NUM;
const to = process.env.DESTINATION_NUM;

const client = require("twilio")(accountSid, authToken);

const sendMessages = client.messages
  .create({
    body: "This is my baptism into TWILIO API",
    from,
    to,
  })
  .then((message) => console.log(message))
  .catch((error) => console.log(error));

module.exports = {
  sendMessages,
};

# Welcome to youService

This app is a simple box mock food based subscription service. During sign up, users take a survey which determines their preference for their box deliveries.

## Installation

- Download zip file
- Install dependencies

```sh
   npm install
```

- Create a `.env` file in the root directory of your project. Add environment-specific variables on new lines in the form of `NAME=VALUE`. You will need the following:

```
PORT=5000
MONGO_URI = <your connection URI>
SALT_ROUNDS = 10
ACCESS_TOKEN_SECRET_KEY = <your key>
REFRESH_TOKEN_SECRET_KEY = <your key
ACCESS_TOKEN_EXPIRES_IN = 15m
REFRESH_TOKEN_EXPIRES_IN = 30d
TWILIO_ACCT_SID = <your sid>
TWILIO_AUTH_TOKEN = <your token>
TRIAL_PHONE_NUM = <your number>
VERIFICATION_PIN_LENGTH = 6
```

## Contribution

- Clone (if direct contributor) / Fork repo and submit pull requests

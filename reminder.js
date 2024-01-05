/** daily reminder using tutorial from https://www.twilio.com/blog/schedule-a-daily-sms-reminder-on-linux-macos-or-windows */
require('dotenv').config();
const mongoose = require('mongoose');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const date = new Date();

client.messages
  .create({
    body: `\n 🩸 Reminder to log your stats - Invektus 🩸`,
    from: process.env.FROM_NUMBER,
    to: '+17038555148',
  })
  .then((message) => console.log(`${date}: ${message.sid}`))
  .catch((error) => console.error(error));

/** attempt to query database */
mongoose
  .connect(process.env.NODE_ENV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected from reminder.js');
  });

fetch('http://localhost:3000/api/getOptedUsers')
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      //   if (Object.hasOwn(data[i], 'optIn') && data[i].optIn === true) {
      client.messages
        .create({
          body: `🩸💉🩸 Friendly reminder to log your stats - Invektus 🩸💉🩸`,
          from: process.env.FROM_NUMBER,
          to: data[i].phoneNumber,
        })
        .then((message) => console.log(`${date}: ${message.sid}`))
        .catch((error) => console.error(error));
      //   }
    }
  });

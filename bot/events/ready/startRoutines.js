require("dotenv").config();
const { ActivityType, setActivity } = require("discord.js");

module.exports = async (client) => {
  try {
    console.log(`✅ Started routine cycle`);
  } catch (error) {
    console.error("Error while starting routines.", `${error}`);
  }
};

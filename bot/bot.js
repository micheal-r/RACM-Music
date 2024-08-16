console.log("🕑 Starting the discord application");

const Bot = require("./structures/Client.js");

const client = new Bot();
client.setMaxListeners(100);

client.connect();

module.exports = client;

const { EmbedBuilder, DiscordAPIError } = require("discord.js");
const config = require("../../../config/config");
const fs = require("fs");
const path = require("path");
const bugsy = require("../../bugsy");

module.exports = async (client, message) => {
  if (message.webhookId || message.author.bot) {
    return;
  }

  const prefixRegex = new RegExp(
    `^(<@${client.user.id}>|\\${config.prefix})\\s*`
  );
  const [matchedPrefix] = message.content.match(prefixRegex) || [null];

  if (!matchedPrefix) {
    const bugsyRegex = new RegExp(`^(\\${config.bugsy.prefix})\\s*`);
    const [matchedPrefix] = message.content.match(bugsyRegex) || [null];
    if (!matchedPrefix) return;
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!config.bugsy.aliases.includes(commandName)) return;
    bugsy.find(message, args);
  }

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) {
    bugsy.find(message, args);
    return;
  }

  if (
    command.staffOnly &&
    !message.guild.roles.cache
      .get(client.config.ranks.staff)
      .members.has(message.author.id)
  ) {
    return;
  }

  runCommand(client, message, args, command, config.prefix);
};

async function runCommand(client, message, args, command, prefix) {
  try {
    await command.callback(message, args, client, prefix, false);
  } catch (error) {
    if (error instanceof DiscordAPIError && error.code === 50007) {
      return;
    }
    client.error.log(
      client,
      message,
      message.author,
      error,
      command.name,
      "prefix"
    );
  }
}

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "error",
  aliases: [],
  description: "",
  staffOnly: false,
  debugType: false,
  callback: async (message, args, client, prefix, debug) => {
    try {
      if (!client.config.ranks.developers.includes(message.author.id)) {
        message.reply(
          "This command is limited to the bot developers. If you think this is a mistake contact <@976538165273845830>."
        );
        return;
      }
      message.reply(`creating error with reason: ${args.join(" ")}`);
      throw new Error(args.join(" "));
    } catch (error) {
      client.error.log(client, message, message.author, error, module.exports.name, "prefix");
    }
  },
};

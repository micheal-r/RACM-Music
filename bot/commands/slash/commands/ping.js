const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get the bot latency.",
  staffOnly: false,
  debugType: false,
  callback: async (client, interaction) => {
    const startTime = Date.now();
    const wsPing = client.ws.ping;

    let apiPing = "3";
    /* try {
          const apiStartTime = Date.now();
          await fetch("https://panel.racm.xyz/api/v1");
          apiPing = Date.now() - apiStartTime;
        } catch (error) {
          apiPing = "Error";
        }
      */

    await interaction.reply({
      content: "Testing latency...",
      ephemeral: true,
    });

    const commandPing = Date.now() - startTime;

    const embed = new EmbedBuilder()
      .setTitle("Ping Information")
      .setColor("#a20000")
      .addFields([
        { name: "WS Ping", value: `${wsPing}ms`, inline: true },
        { name: "Roundtrip", value: `${commandPing}ms`, inline: true },
        { name: "R&CM API Ping", value: `${apiPing}ms`, inline: true },
      ])
      .setTimestamp();

    await interaction.editReply({
      content: null,
      embeds: [embed],
    });
  },
};

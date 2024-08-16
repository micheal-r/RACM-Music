const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription("You need to be in a voice channel to play music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await client.distube.skip(voiceChannel);

      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Song skipped")
        .setDescription(`Skipped the current song.`);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription(`An error occurred: ${error.message}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

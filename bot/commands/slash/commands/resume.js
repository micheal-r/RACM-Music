const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  description: "Resume the currently paused song.",
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription("You need to be in a voice channel to resume music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = client.distube.getQueue(voiceChannel);
      if (queue) {
        queue.resume();
        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Resumed")
          .setDescription("The music has been resumed.");
        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Error")
          .setDescription("There is no music playing currently.");
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription(`An error occurred: ${error.message}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

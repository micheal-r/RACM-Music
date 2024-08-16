const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stop the music and clear the queue.",
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription("You need to be in a voice channel to stop the music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = client.distube.getQueue(voiceChannel);
      if (queue) {
        queue.stop();
        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Stopped")
          .setDescription("The music has been stopped and the queue cleared.");
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

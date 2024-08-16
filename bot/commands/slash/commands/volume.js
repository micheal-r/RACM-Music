const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Adjust the volume of the music playback.",
  options: [
    {
      name: "level",
      description: "The volume level to set (0-100).",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    const level = interaction.options.getInteger("level");

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription(
          "You need to be in a voice channel to adjust the volume!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = client.distube.getQueue(voiceChannel);

      if (level !== null) {
        if (queue) {
          client.distube.setVolume(voiceChannel, level);
          const embed = new EmbedBuilder()
            .setColor("#00a200")
            .setTitle("Volume Set")
            .setDescription(`Volume has been set to ${level}.`);
          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor("#a20000")
            .setTitle("Error")
            .setDescription("There is no music playing currently.");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } else {
        if (queue) {
          const currentVolume = queue.volume;
          const embed = new EmbedBuilder()
            .setColor("#a20000")
            .setTitle("Current Volume")
            .setDescription(`The current volume level is ${currentVolume}.`);
          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor("#a20000")
            .setTitle("Error")
            .setDescription("There is no music playing currently.");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
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

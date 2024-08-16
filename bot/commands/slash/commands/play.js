const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a song or a playlist using a name or a link.",
  options: [
    {
      name: "song",
      description: "The song or playlist name/link you want to play.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const song = interaction.options.getString("song").trim();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription("You need to be in a voice channel to play music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await client.distube.play(voiceChannel, song, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction,
      });

      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Playing Song")
        .setDescription(`Searching and playing \`${song}\`...`);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const fallbackQuery = song;
      try {
        await client.distube.play(voiceChannel, fallbackQuery, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        });

        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Playing Song")
          .setDescription(`Searching and playing \`${fallbackQuery}\`...`);
        await interaction.reply({ embeds: [embed] });
      } catch (fallbackError) {
        let errorMessage = "An error occurred while trying to play the song.";
        if (error.message.includes("private or unavailable")) {
          errorMessage =
            "The URL is private or unavailable. Please check the link and try again.";
        } else if (error.message.includes("Resource not found")) {
          errorMessage =
            "The requested resource was not found. Please ensure the link is correct.";
        } else if (error.message.includes("Invalid URL")) {
          errorMessage =
            "The URL is invalid. Please provide a valid YouTube or Spotify link.";
        }

        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Error")
          .setDescription(errorMessage);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};

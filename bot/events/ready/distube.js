const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  const status = (queue) =>
    `Volume: \`${queue.volume}%\` |  Filter: \`${
      queue.filters.names.join(", ") || "Inactive"
    }\` | Repeat: \`${
      queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Track") : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
  client.distube
    .on("playSong", (queue, song) =>
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription(
              `<a:music:1274067677983408199> | Playing: \`${song.name}\` - \`${
                song.formattedDuration
              }\`\nFrom: ${song.user}\n${status(queue)}`
            ),
        ],
      })
    )
    .on("addSong", (queue, song) =>
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription(
              `<a:music:1274067677983408199> | Added \`${song.name}\` - \`${song.formattedDuration}\` to queue by: ${song.user}`
            ),
        ],
      })
    )
    .on("addList", (queue, playlist) =>
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription(
              `<a:music:1274067677983408199> | Added from \`${
                playlist.name
              }\` : \`${playlist.songs.length} \` queue tracks; \n${status(
                queue
              )}`
            ),
        ],
      })
    )
    .on("empty", (channel) =>
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription(
              "⛔ | The voice channel is empty! Leaving the channel..."
            ),
        ],
      })
    )
    .on("searchNoResult", (message, query) =>
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription("`⛔ | No results found for: `${query}`!`"),
        ],
      })
    )
    .on("finish", (queue) =>
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#a20000")
            .setDescription("🏁 | The queue is finished!"),
        ],
      })
    );
};

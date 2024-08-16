const { EmbedBuilder } = require("discord.js");

async function handlePaginationWithReactions(client, interaction, content) {
  try {
    const chunks = [];
    let currentChunk = "";
    const maxChunkSize = 1500;

    for (const line of content.split("\n")) {
      if (currentChunk.length + line.length + 1 > maxChunkSize) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      currentChunk += line + "\n";
    }
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    let page = 0;
    const totalPages = chunks.length;

    const replyMsg = await interaction.reply({
      content: `\`\`\`json\n${chunks[page]}\`\`\``,
      fetchReply: true,
    });

    await replyMsg.react("⬅️");
    await replyMsg.react("➡️");
    await replyMsg.react("⏹️");

    const filter = (reaction, user) =>
      ["⬅️", "➡️", "⏹️"].includes(reaction.emoji.name) &&
      user.id === interaction.user.id;

    const collector = replyMsg.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction) => {
      if (reaction.emoji.name === "➡️") {
        page = (page + 1) % totalPages;
      } else if (reaction.emoji.name === "⬅️") {
        page = (page - 1 + totalPages) % totalPages;
      } else if (reaction.emoji.name === "⏹️") {
        collector.stop();
        await replyMsg.reactions.removeAll();
        return;
      }

      await replyMsg.edit({
        content: `\`\`\`json\n${chunks[page]}\`\`\``,
      });

      await reaction.users.remove(interaction.user.id);
    });

    collector.on("end", async () => {
      await replyMsg.reactions.removeAll();
    });
  } catch (err) {
    interaction.reply(`\`\`\`js\n${err.toString()}\`\`\``);
  }
}
module.exports = {
  name: "queue",
  description: "Show the current music queue.",
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription("You need to be in a voice channel to view the queue!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = client.distube.getQueue(voiceChannel);

      if (queue && queue.songs.length > 0) {
        const songList = queue.songs
          .map(
            (song, index) =>
              `${index + 1}. ${song.name} - ${song.formattedDuration}`
          )
          .join("\n");

        await handlePaginationWithReactions(client, interaction, songList);
      } else {
        const embed = new EmbedBuilder()
          .setColor("#a20000")
          .setTitle("Queue")
          .setDescription("The queue is currently empty.");
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);

      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription(`An error occurred: ${error.message}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

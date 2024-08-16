const { CohereClient } = require("cohere-ai");
const { EmbedBuilder } = require("discord.js");

const cohere = new CohereClient({
  token: "XLfKjiScVYbSHc5S5UuZx2pf2bcSx57jedyREi9s",
});

const conversationHistory = new Map();

module.exports = async (client, message) => {
  if (message.channel.id !== client.config.channels.ai_chat) return;
  if (message.author.bot) return;
  if (message.content.startsWith("*")) return;

  const load = new EmbedBuilder()
    .setColor(`#a20000`)
    .setTitle(`Loading...`)
    .setDescription(`🕒 Your response is being generated. Please wait.`)
    .setTimestamp();

  const msg = await message.reply({ embeds: [load] });

  try {
    const now = Date.now();
    let userHistoryData = conversationHistory.get(message.author.id);

    if (!userHistoryData || now - userHistoryData.lastMessageTime > 1800000) {
      userHistoryData = { history: [], lastMessageTime: now };
    } else {
      userHistoryData.lastMessageTime = now;
    }

    const userHistory = userHistoryData.history;
    userHistory.push(`User: ${message.content}`);

    const fullMessage = userHistory.join("\n") + `\nBot:`;

    const reply = await cohere.chat({
      model: "command",
      message: `Your name is Races & Car Meets AI, the server is a roblox ER:LC private server about races. You're a playful and nice AI that likes to help people and be funny. Give them as much as you can and a little over the top is never bad. Do not help people on their staff applications in any way.\n\nRespond to: I am ${message.author.username} and my message is: ${message.content}\n\nConversation context: ${fullMessage}`,
    });

    const replyText = reply.text || "No response generated.";

    userHistory.push(`Bot: ${replyText}`);

    if (userHistory.length > 5) userHistory.splice(0, userHistory.length - 5);

    conversationHistory.set(message.author.id, {
      history: userHistory,
      lastMessageTime: now,
    });

    const maxDescriptionLength = 4000;
    const embeds = [];

    // Split replyText into chunks of 4000 characters
    for (let i = 0; i < replyText.length; i += maxDescriptionLength) {
      const chunk = replyText.substring(i, i + maxDescriptionLength);
      const embed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("AI Response")
        .setDescription(chunk)
        .setTimestamp();
      embeds.push(embed);
    }

    await msg.edit({ embeds });
  } catch (error) {
    if (error.statusCode === 429) {
      const rl = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Rate Limited")
        .setDescription("Slow down! You are going too fast, try again later.")
        .setTimestamp();

      await msg.edit({ embeds: [rl] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#a20000")
        .setTitle("Error")
        .setDescription(`An error occurred: ${error.message}`)
        .setTimestamp();

      await msg.edit({ embeds: [errorEmbed] });
    }
  }
};

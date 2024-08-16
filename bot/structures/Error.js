const chalk = require("chalk");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const buttonHandler = require("../handlers/buttonHandler");

class Error {
  static async log(client, interaction, user, error, name, type) {
    const id = generateErrorId();
    const data = {
      name: name,
      type: type,
      time: Date.now(),
      id: id,
    };
    if (!interaction) {
      this.storeError(client, null, null, error, data);
      console.log(
        chalk.red(`[${error.type}] Code: ${error.code}\n${error.stack}`)
      );
    } else {
      this.storeError(client, interaction, user, error, data);
      this.notifyError(client, interaction, user, error, data);
      console.log(
        chalk.red(
          `[${error.type}] Code: ${error.code} in ${interaction.guild.name}, ${interaction.channel.name} (${interaction.channel.id}) | ${interaction.createdTimestamp}\n${error.stack}`
        )
      );
    }
  }

  static async storeError(client, interaction, user, error, data) {
    // function to store error (making this fucking horrible thing later (i hate mongoDB))
  }

  static async notifyError(client, interaction, user, error, data) {
    const lineP1 = `${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}`;
    const lineP2 = `${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}`;
    const lineP3 = `${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}${client.emoji.redLine}`;
    const line = `${lineP1}${lineP2}${lineP3}`;
    const errorEmbed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: `The bot raised an error`,
        iconURL: `https://cdn.discordapp.com/emojis/1247209442458734706.webp?size=60&quality=lossless`,
      })
      .addFields({
        name: `Error information`,
        value: `${client.emoji.lineEnd}\`${data.id}\``,
      });
    switch (data.type) {
      case "prefix":
      case "slash":
        errorEmbed.setDescription(
          `The \`${data.name}\` command raised an error.\nTry again later before contacting support.\n${line}`
        );
        break;
      case "Button":
        errorEmbed.setDescription(
          `The \`${data.name}\` button raised an error.\nTry again later before contacting support.\n${line}`
        );
        break;
      default:
        errorEmbed.setDescription(
          `${data.name} raised an error.\nTry again later before contacting support.\n${line}`
        );
        break;
    }
    const supportButton = new ButtonBuilder()
      .setLabel("Reach out to support")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/erlc");
    const detailButton = new ButtonBuilder()
      .setCustomId(`error-detail-${data.id}`)
      .setLabel("Error Details")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      supportButton,
      detailButton
    );

    const msg = await interaction.reply({
      embeds: [errorEmbed],
      components: [row],
    });
    buttonHandler.registerButton(detailButton, msg, {
      callback: async (interaction) => {
        const errorId = interaction.customId.split("-")[2];
        await this.errorDetails(interaction, errorId);
      },
      time: Date.now(),
    });
  }

  static async errorDetails(interaction, id) {
    const errorData = await this.getErrorData(id);
    if (!errorData) {
      return interaction.reply({
        content: "Error not found.",
        ephemeral: true,
      });
    }
    interaction.reply({ content: `${errorData}`, ephemeral: true });
  }

  static async getErrorData(id) {
    return 123;
  }
}

module.exports = Error;

function generateErrorId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let errorId = "";
  for (let i = 0; i < 12; i++) {
    errorId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return errorId;
}

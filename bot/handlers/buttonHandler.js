const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");

const interactionRegistry = new Map();

class ButtonHandler {
  static registerButton(button, ctx, data) {
    let id;
    if (ctx.interaction && ctx.interaction.ephemeral)
      id = `${button.data.custom_id}_${ctx.interaction.user.id}`;
    else id = `${button.data.custom_id}_${ctx.id}`;
    data.keep = data.time + 1000 * 60 * 60 * 24 * 7;
    interactionRegistry.set(id, data);
  }

  static getButton(interactionId) {
    return interactionRegistry.get(interactionId);
  }

  static handleButton(client, interaction) {
    try {
      let data;
      if (
        interaction.customId.startsWith("&") &&
        interaction.message.webhookId !== null
      ) {
        data = interactionRegistry.get(
          `${interaction.customId}_${interaction.user.id}`
        );
      } else {
        data = interactionRegistry.get(
          `${interaction.customId}_${interaction.message.id}`
        );
      }
      if (data && data.callback) {
        data.callback(interaction);
      } else {
        const button = new EmbedBuilder()
          .setColor(client.config.embedColor2)
          .setTitle("Button not recognized")
          .setDescription(
            "This button is not recognized, try running the command again.\nIf you think this is a mistake, please contact support."
          );
        const supportButton = new ButtonBuilder()
          .setLabel("Reach out to support")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/erlc");
        const row = new ActionRowBuilder().addComponents(supportButton);

        interaction.reply({
          embeds: [button],
          components: [row],
          ephemeral: true,
        });
      }
    } catch (error) {
      client.error.log(
        client,
        interaction.message,
        interaction.user,
        error,
        interaction.name,
        "button"
      );
    }
  }

  static cleanupButton(button, ctx) {
    if (!button) {
      interactionRegistry.delete(ctx);
      return;
    }
    let id;
    if (ctx.interaction && ctx.interaction.ephemeral)
      id = `${button.data.custom_id}_${ctx.interaction.user.id}`;
    else id = `${button.data.custom_id}_${ctx.id}`;
    interactionRegistry.delete(id);
  }

  static cleanupAllButtons() {
    interactionRegistry.forEach((value, key) => {
      if (value.keep < Date.now()) {
        interactionRegistry.delete(key);
      }
    });
  }
}

module.exports = ButtonHandler;

setInterval(ButtonHandler.cleanupAllButtons, 1000 * 60 * 60);

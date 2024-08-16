const {
  InteractionType,
  EmbedBuilder,
  DiscordAPIError,
  PermissionsBitField,
} = require("discord.js");
const config = require("../../../config/config");
const fs = require("fs");
const path = require("path");

module.exports = async (client, interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  if (command.staffOnly) {
    if (!interaction.member.roles.cache.has(client.config.ranks.staff)) {
      const noPermEmbed = new EmbedBuilder()
        .setTitle("Insufficient permissions")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ format: "png", size: 2048 }),
        })
        .setColor(client.config.embedColor)
        .setDescription(
          `You do not have enough permissions to run this command. If you think this was a mistake, please contact the server admin.`
        )
        .setFooter({
          text: `${client.config.name}`,
          iconURL: client.user.displayAvatarURL({ format: "png", size: 2048 }),
        });
      return interaction.reply({ embeds: [noPermEmbed] });
    }
  }

  if (command.userPerms || command.botPerms) {
    const missingPermissionsEmbed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ format: "png", size: 2048 }),
      })
      .setColor(client.config.embedColor)
      .setDescription(
        `You do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`
      )
      .setFooter({
        text: `${client.config.name}`,
        iconURL: client.user.displayAvatarURL({ format: "png", size: 2048 }),
      });

    if (
      command.botPerms &&
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPerms)
      )
    ) {
      missingPermissionsEmbed.setDescription(
        `I don't have the \`${
          command.botPerms
        }\` permission in ${interaction.channel.toString()} to execute the \`${
          command.name
        }\` command.`
      );
      return interaction.reply({ embeds: [missingPermissionsEmbed] });
    }

    if (
      command.userPerms &&
      !interaction.member.permissions.has(
        PermissionsBitField.resolve(command.userPerms)
      )
    ) {
      missingPermissionsEmbed.setDescription(
        `You don't have the \`${
          command.userPerms
        }\` permission in ${interaction.channel.toString()} to execute the \`${
          command.name
        }\` command.`
      );
      return interaction.reply({ embeds: [missingPermissionsEmbed] });
    }
  }

  try {
    await command.callback(client, interaction, client.config.prefix);
  } catch (error) {
    if (error instanceof DiscordAPIError && error.code === 50007) return;
    client.error.log(
      client,
      interaction,
      interaction.user,
      error,
      command.name,
      "prefix"
    );
  }
};

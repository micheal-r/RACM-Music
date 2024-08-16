const {
  InteractionType,
  EmbedBuilder,
  DiscordAPIError,
  PermissionsBitField,
} = require("discord.js");
const config = require("../../../config/config");
const fs = require("fs");
const path = require("path");
const buttonHandler = require("../../handlers/buttonHandler");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;
  buttonHandler.handleButton(client, interaction);
}
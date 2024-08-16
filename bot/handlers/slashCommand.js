const { readdirSync } = require("fs");
const { PermissionsBitField, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

module.exports = (client) => {
  const data = [];
  let count = 0;
  readdirSync("./bot/commands/slash/").forEach((dir) => {
    const slashCommandFile = readdirSync(`./bot/commands/slash/${dir}`).filter(
      (files) => files.endsWith(".js")
    );

    for (const file of slashCommandFile) {
      const slashCommand = require(`../commands/slash/${dir}/${file}`);

      if (!slashCommand.name)
        return console.error(
          `slashCommandNameError: application command name is required.`
        );

      if (!slashCommand.description)
        return console.error(
          `slashCommandDescriptionError: application command description is required.`
        );

      client.slashCommands.set(slashCommand.name, slashCommand);

      data.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_member_permissions: slashCommand.default_member_permissions
          ? PermissionsBitField.resolve(
              slashCommand.default_member_permissions
            ).toString()
          : null,
      });
      count++;
    }
  });
  console.log(`✅ Loaded ${count} application commands`);
  const rest = new REST({ version: "10" }).setToken(client.config.discordToken);
  (async () => {
    try {
      console.log(`✅ Started reloading application commands`);
      rest.put(Routes.applicationCommands(client.config.discordId), {
        body: data,
      });
      console.log(`✅ Reloaded all application commands`);
    } catch (error) {
      console.error(error);
    }
  })();
};

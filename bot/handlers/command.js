const { readdirSync } = require("fs");

module.exports = (client) => {
  let count = 0;
  readdirSync("./bot/commands/").forEach((dir) => {
    const commandFiles = readdirSync(`./bot/commands/${dir}/`).filter((f) =>
      f.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(`../commands/${dir}/${file}`);
      if (command && !(command.disabled ? command.disabled : false)) {
        if (command.name) {
          client.commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
              client.aliases.set(alias, command.name);
            });
          }
          count++;
        }
      }
    }
  });
  console.log(`✅ Loaded ${count} prefix commands`);
};

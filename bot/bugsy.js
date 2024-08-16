const client = require("./bot");
const config = require("../config/config");
const buttonHandler = require("./handlers/buttonHandler");
const {
  ButtonBuilder,
  IntentsBitField,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const discordjs = require("discord.js");
const bugsyConfig = config.bugsy;

const commands = {
  js: () => js,
  debug,
  test: () => debug,
  error,
  err: () => error,
  help: () => help,
};

class Bugsy {
  static async find(ctx, args) {
    try {
      if (!config.ranks.developers.includes(ctx.author.id)) return;
      ctx.data = {
        raw: ctx.content,
        type: args[0],
        args: args.slice(1),
      };
      if (!ctx.data.type) return main(client, ctx);
      switch (ctx.data.type) {
        case "js":
        case "javascript":
          js(client, ctx);
          break;
        case "debug":
        case "test":
          debug(client, ctx);
          break;
        case "error":
        case "err":
          error(client, ctx);
          break;
        case "help":
          help(client, ctx);
          break;
        default:
          if (config.prefix === bugsyConfig.prefix)
            ctx
              .reply(
                `Available Options: ${Object.keys(commands)
                  .filter((t) => t !== "main")
                  .map((t) => `\`${t}\``)
                  .join(", ")}`
              )
              .then((rply) => {
                setTimeout(() => {
                  ctx.delete();
                  rply.delete();
                }, 10000);
              });
      }
    } catch (err) {
      client.error.log(
        client,
        ctx,
        ctx.author,
        err,
        module.exports.name,
        "bugsy"
      );
    }
  }
}

module.exports = Bugsy;

async function main(client, ctx) {
  try {
    const intents = new IntentsBitField(client.options.intents);
    let reply = `Discord JS version: \`${
      discordjs.version
    }\`  Node JS version: \`${process.version}\` on \`${
      process.platform
    }\`\nBot Name: \`${client.user.tag}\`  ID: \`${
      client.user.id
    }\`\nProccess started: ${Timestamp.relative(
      Systeminfo.processStart()
    )}  RAM usage: \`${
      Systeminfo.memory().rss
    }\`  CPU usage: \`${Systeminfo.cpu()}%\``;
    ctx.reply(reply);
  } catch (err) {
    client.error.log(
      client,
      ctx,
      ctx.author,
      err,
      module.exports.name,
      "bugsy"
    );
  }
}

async function help(client, ctx) {
  try {
    if (!ctx.data.args[0]) {
      ctx
        .reply(
          `Use \`${
            bugsyConfig.prefix
          }bgy help <command>\` to get more info on a specific command.\nList of commands:\n>>> ${Object.keys(
            commands
          )
            .filter((t) => t !== "main")
            .map((t) => `\`${t}\``)
            .join("\n")}`
        )
        .then((rply) => {
          setTimeout(() => {
            ctx.delete();
            rply.delete();
          }, 10000);
        });
      return;
    }
    const command = commands[ctx.data.args[0]];
    if (!command) {
      ctx
        .reply(
          `\`${ctx.data.args[0]}\` is not a valid command. Use \`${bugsyConfig.prefix}bgy help\` to get a list of commands.`
        )
        .then((rply) => {
          setTimeout(() => {
            ctx.delete();
            rply.delete();
          }, 10000);
        });
      return;
    }
    switch (ctx.data.args[0]) {
      case "js":
      case "javascript":
        ctx
          .reply(
            `Run JS code in the bots environment.\n> ${bugsyConfig.prefix}bgy js <code>`
          )
          .then((rply) => {
            setTimeout(() => {
              ctx.delete();
              rply.delete();
            }, 10000);
          });
        break;
      case "debug":
      case "test":
        ctx
          .reply(
            `Debug command performance and errors.\n> ${bugsyConfig.prefix}bgy debug <command>`
          )
          .then((rply) => {
            setTimeout(() => {
              ctx.delete();
              rply.delete();
            }, 10000);
          });
        break;
      case "error":
      case "err":
        ctx
          .reply(
            `Get more information about a certain error ID.\n> ${bugsyConfig.prefix}bgy error <id>`
          )
          .then((rply) => {
            setTimeout(() => {
              ctx.delete();
              rply.delete();
            }, 10000);
          });
        break;
      case "help":
        ctx
          .reply(
            `Get information about a Bugsy command\n> ${bugsyConfig.prefix}bgy help <command>`
          )
          .then((rply) => {
            setTimeout(() => {
              ctx.delete();
              rply.delete();
            }, 10000);
          });
        break;
    }
  } catch (err) {
    client.error.log(
      client,
      ctx,
      ctx.author,
      err,
      module.exports.name,
      "bugsy"
    );
  }
}

async function js(client, ctx) {
  try {
    const isMessage = ctx instanceof discordjs.Message;
    let message = ctx;
    let guild = message.guild;
    let channel = message.channel;
    const run = new Promise((resolve) =>
      resolve(eval(isMessage ? ctx.data.args.join(" ") : ""))
    );
    const t = await run.then(async (output) => {
      try {
        const sensitiveKeys = [
          "discordToken",
          "discordSecret",
          "appSecret",
          "mongo_uri",
          "prc_key",
          "erm_key",
        ];

        function redactSensitiveInfo(jsonData) {
          const jsonString = JSON.stringify(
            jsonData,
            (key, value) => {
              if (sensitiveKeys.includes(key)) {
                return "REDACTED";
              }
              return value;
            },
            2
          );
          return JSON.parse(jsonString);
        }
        output = redactSensitiveInfo(output);
        if (output instanceof discordjs.Embed) {
          ctx.reply({ embeds: [output] });
          return;
        }
        if (output instanceof discordjs.Attachment) {
          ctx.reply({
            files:
              target instanceof discordjs.Collection
                ? target.toJSON()
                : [target],
          });
          return;
        }
        if (output instanceof discordjs.Message) {
          ctx.reply(output);
          return;
        }
        if (output instanceof Object) {
          const msgT = JSON.stringify(output, null, 2);
          if (!msgT.length > 2000) {
            ctx.reply(`\`\`\`json\n${JSON.stringify(output, null, 2)}\`\`\``);
            return;
          }
          //split msgT into parts of 2000 characters so that they are accepted by discord
          const msg = [];
          let currentChunk = "";
          for (const line of msgT.split("\n")) {
            if (currentChunk.length + line.length + 1 > 1500) {
              msg.push(currentChunk);
              currentChunk = "";
            }
            currentChunk += line + "\n";
          }
          if (currentChunk) {
            msg.push(currentChunk);
          }

          let page = 0;
          const nextPage = new ButtonBuilder()
            .setCustomId(`bugsy$nextpage`)
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("➡️");
          const stopCollecting = new ButtonBuilder()
            .setCustomId(`bugsy$stop`)
            .setLabel("Stop")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⏹️");
          const previousPage = new ButtonBuilder()
            .setCustomId(`bugsy$prevpage`)
            .setLabel("Back")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⬅️");

          const row = new ActionRowBuilder().addComponents(
            previousPage,
            stopCollecting,
            nextPage
          );
          const replyMsg = await ctx.reply({
            content: `\`\`\`json\n${msg[page]}\`\`\``,
            components: [row],
          });
          buttonHandler.registerButton(nextPage, replyMsg, {
            callback: async (interaction) => {
              page++;
              if (page >= msg.length) {
                page = 0;
              }
              replyMsg.edit({
                content: `\`\`\`json\n${msg[page]}\`\`\``,
                components: [row],
              });
              interaction.deferUpdate();
            },
            time: Date.now(),
          });
          buttonHandler.registerButton(stopCollecting, replyMsg, {
            callback: async (interaction) => {
              replyMsg.edit({
                content: `\`\`\`json\n${msg[page]}\`\`\``,
                components: [],
              });
              buttonHandler.cleanupButton(previousPage, replyMsg);
              buttonHandler.cleanupButton(stopCollecting, replyMsg);
              buttonHandler.cleanupButton(nextPage, replyMsg);
              const trashMessage = new ButtonBuilder()
                .setCustomId(`&bugsy$deletemsg`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️");
              const keepMessage = new ButtonBuilder()
                .setCustomId(`&bugsy$keepmsg`)
                .setLabel("Stop")
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅");
              const row = new ActionRowBuilder().addComponents(
                keepMessage,
                trashMessage
              );
              const rply = await interaction.reply({
                content:
                  "Stopped the button collector. Would you like to delete the message?",
                components: [row],
                ephemeral: true,
              });
              buttonHandler.registerButton(trashMessage, rply, {
                callback: async (interaction) => {
                  replyMsg.delete();
                  rply.delete();
                  ctx.delete();
                  interaction.deferUpdate();
                },
                time: Date.now(),
              });
              buttonHandler.registerButton(keepMessage, rply, {
                callback: async (interaction) => {
                  rply.delete();
                  interaction.deferUpdate();
                },
                time: Date.now(),
              });
              return;
            },
            time: Date.now(),
          });
          buttonHandler.registerButton(previousPage, replyMsg, {
            callback: async (interaction) => {
              page--;
              if (page < 0) {
                page = msg.length - 1;
              }
              replyMsg.edit({
                content: `\`\`\`json\n${msg[page]}\`\`\``,
                components: [row],
              });
              interaction.deferUpdate();
            },
            time: Date.now(),
          });
          return;
        }
        if (output instanceof Array) {
          ctx.reply(`\`\`\`json\n${JSON.stringify(output, null, 2)}\`\`\``);
          return;
        }
        ctx.reply(`${output.toString()}`);
      } catch (err) {
        ctx.reply(`\`\`\`js\n${err.toString()}\`\`\``);
      }
    });
  } catch (err) {
    client.error.log(
      client,
      ctx,
      ctx.author,
      err,
      module.exports.name,
      "bugsy"
    );
  }
}

async function debug(client, ctx) {
  try {
  } catch (err) {
    client.error.log(
      client,
      ctx,
      ctx.author,
      err,
      module.exports.name,
      "bugsy"
    );
  }
}

async function error(client, ctx) {
  try {
  } catch (err) {
    client.error.log(
      client,
      ctx,
      ctx.author,
      err,
      module.exports.name,
      "bugsy"
    );
  }
}

class Timestamp {
  static format(date, style) {
    return (
      `<t:${Math.floor(Number(date) / 1e3)}` + (style ? `:${style}` : "") + ">"
    );
  }
  static relative(date) {
    return this.format(date, "R");
  }
}

let startTime = process.hrtime();
let startUsage = process.cpuUsage();
let prev;

class Systeminfo {
  static memory() {
    const memory = process.memoryUsage();
    const keys = Object.keys(memory);
    const a = memory;
    keys.forEach((key) => {
      memory[key] = (a[key] / 1024 / 1024).toFixed(2) + "MB";
    });
    return memory;
  }
  static processStart() {
    return new Date(Date.now() - process.uptime() * 1e3);
  }
  static cpu() {
    const endUsage = process.cpuUsage(startUsage);
    const endTime = process.hrtime(startTime);
    const elapsedTime = endTime[0] + endTime[1] / 1e9;
    const cpuPercent = (endUsage.user + endUsage.system) / 1e6 / elapsedTime;
    startTime = process.hrtime();
    startUsage = process.cpuUsage();
    let data = Math.floor(cpuPercent * 100000);
    if (!data) data = prev;
    prev = data;
    return data / 100;
  }
}

const config = require("../../config/config");
const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk"); // Use 'require' instead of 'import'

/**
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
  const log = (type, message) => {
    console.log(`[AntiCrash] | [${type}_Logs] | [Start] : ===============`);
    console.log(message);
    console.log(`[AntiCrash] | [${type}_Logs] | [End] : ===============`);
  };

  process.on("beforeExit", (code) => {
    log("BeforeExit", code);
  });

  process.on("exit", (error) => {
    log("Exit", error);
  });

  process.on("unhandledRejection", (reason, promise) => {
    log("UnhandledRejection", { reason, promise });
  });

  process.on("rejectionHandled", (promise) => {
    log("RejectionHandled", promise);
  });

  process.on("uncaughtException", (err, origin) => {
    log("UncaughtException", { err, origin });
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    log("UncaughtExceptionMonitor", { err, origin });
  });

  process.on("warning", (warning) => {
    log("Warning", warning);
  });

  console.log(`✅ Loaded the errorHandler (AntiCrash)`);
};

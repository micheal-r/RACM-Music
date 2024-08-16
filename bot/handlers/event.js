const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = async (client) => {
  const registerEvent = async (eventFolder) => {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort();

    const eventName = path.basename(eventFolder);

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        try {
          const eventFunction = require(eventFile);
          await eventFunction(client, arg);
        } catch (error) {
          console.error(`Error loading event file ${eventFile}:`, error);
        }
      }
    });
  };

  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  await Promise.all(eventFolders.map(registerEvent));
};

require("dotenv").config();
const { ActivityType, setActivity } = require("discord.js");

module.exports = async (client) => {
  try {
    client.user.setStatus("online");
    let status = [
      {
        name: "to music",
        type: ActivityType.Listening,
      },
      {
        name: "over voice chats",
        type: ActivityType.Watching,
      },
    ];

    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random]);
    }, 30000);
    console.log(`✅ Changed ${client.user.tag} presence`, "ready");
  } catch (error) {
    console.error("❌ Error while changing presence", `${error}`);
  }
  {
  }
};

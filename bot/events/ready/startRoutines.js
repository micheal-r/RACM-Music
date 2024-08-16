require("dotenv").config();
const { ActivityType, setActivity } = require("discord.js");

module.exports = async (client) => {
  console.log(client.prc.getUsersByTeam("DOT"));
  try {
    require("../../utils/routines.js").updateMemberCount(client);
    setInterval(() => {
      require("../../utils/routines.js").updateMemberCount(client);
      console.log("🕒 Routine cycled.");
    }, 60000);
    console.log(`✅ Started routine cycle`);
  } catch (error) {
    console.error("Error while changing presence", `${error}`);
  }
};

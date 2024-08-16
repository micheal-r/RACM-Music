class Routines {
  static async updateMemberCount(client) {
    if (client.serverStatus === "SSD") {
      client.prc.memberCount = "0";
      return;
    }

    try {
      const response = await fetch(
        "https://api.policeroleplay.community/v1/server/players",
        {
          method: "GET",
          headers: {
            "Server-Key": client.config.prc_key,
          },
        }
      );

      if (!response.ok) {
        console.error(
          `❌ Failed to fetch PRC API. Status: ${response.status} ${response.statusText}`
        );
        client.prc.memberCount = "?";
        return;
      }

      const data = await response.json();
      client.prc.memberCount = String(Object.keys(data).length || "?");
    } catch (error) {
      console.error("❌ Error in updateMemberCount routine:", error.message);
      client.prc.memberCount = "?";
    }
  }
}

module.exports = Routines;

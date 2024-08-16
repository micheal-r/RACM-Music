const { default: SoundCloudPlugin } = require("@distube/soundcloud");
const { default: SpotifyPlugin } = require("@distube/spotify");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { DisTube } = require("distube");
require("dotenv").config();

class Bot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
    });

    this.distube = new DisTube(this, {
      plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
      emitNewSongOnly: true,
    });
    this.manager = require("./Manager.js");
    this.config = require("../../config/config.js");
    this.emoji = require("../../config/emoji.json");
    this.slashCommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.linkCodes = new Collection();
    this.error = require("./Error.js");
    this.serverStatus = "SSD";

    this.rest.on("rateLimited", (info) => {
      console.error("REST rate limited:", info);
    });

    this.loadHandlers();
  }

  async connect() {
    try {
      await super.login(this.config.discordToken);
      console.log("✅ Successfully logged in");
    } catch (error) {
      console.error("❌ Error logging in:", error);
    }
  }

  loadHandlers() {
    ["command", "slashCommand", "event", "error"].forEach((handler) => {
      try {
        require(`../handlers/${handler}`)(this);
      } catch (error) {
        console.error(`❌ Failed to load ${handler} handler:`, error);
      }
    });
  }
}

module.exports = Bot;

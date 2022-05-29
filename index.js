import { Client } from 'discord.js';

const client = new Client({
  partials: ['MESSAGE'],
  intents: ['GUILDS', 'GUILD_MESSAGES'],
});

let domains = await fetch(
  'https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/txt/domain-list.txt'
)
  .then((response) => response.text())
  .then((text) => text.split('\n'));

const isScamMessage = (message) => {
  // Get all URLs in message
  const urls = message.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );

  // Check if any of the URLs is in the list
  if (urls) {
    for (let url of urls) {
      const parsedUrl = new URL(url);
      if (
        domains.includes(parsedUrl.hostname) ||
        domains.includes(parsedUrl.hostname.split('.').slice(-2).join('.')) ||
        domains.includes(parsedUrl.hostname.split('.').slice(-3).join('.'))
      ) {
        return true;
      }
    }
  }

  return false;
};

// On message
client.on('messageCreate', (message) => {
  if (isScamMessage(message.content)) {
    message.delete();
  }
});

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
  console.log(`Domains: ${domains.length} | Guilds: ${client.guilds.cache.size}`);
  console.log(
    `Invite link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=9216`
  );
});

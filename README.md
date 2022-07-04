
<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://i.ibb.co/r3THbcc/top-gg.png" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@foup/topgg"><img src="https://img.shields.io/npm/v/@foup/topgg.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://github.com/discordbump/topgg.js/actions"><img src="https://github.com/discordbump/topgg.js/actions/workflows/test.yml/badge.svg?" alt="Tests status" /></a>
  </p>
</div>

## About

topgg.js is a API wrapper for [Top.gg](https://docs.top.gg) that allows you to manage your discord bot

- Quick setup
- Simple functions

## Installation

```sh-session
npm install topgg.js
```

## Example usage

Install all required dependencies:

```sh-session
npm install topgg.api
```

Create a connection between your Top.gg bot and the API

```js
import Client from 'topgg.js';
import Discord from 'discord.js';

const client = new Discord.Client();

const TopGGClient = new Client("TOPGG_WEBHOOK_TOKEN", client);
```

Afterwards we can create a quite simple example usage:

```js
import DBL from 'topgg.js';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TopGG = new DBL("webhook-token", client);

client.on('ready', async () => {
	await TopGG.postStats({
		server_count: 123
	});
	console.log(`Logged in as ${client.user.tag}!`);
});

TopGG.on("posted", () => console.log("Top.gg stats have been updated!"))

client.login('token');
```

## Links

- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js)

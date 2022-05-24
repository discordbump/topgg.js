import Discord from 'discord.js';
import EventEmitter from 'events';
import fetch from 'node-fetch';

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "ApiError";
    }
};

export default class TopGG {
    getBase() {
        let url = this.base;
        if (
            !url.startsWith('https://') &&
            !url.startsWith('http://')
        ) url = 'https://' + url;
        if (!url.endsWith("/")) url += "/";
        return url;
    }

    base = "https://top.gg/api"

    enpointUrl(endpoint) {
        return this.getBase() + endpoint;
    };

    Events = new EventEmitter();

    on = this.Events.on;


    /**
     * Create connection between API and your bot (has to be on Top.gg)
     * @param {string} Authorization Top.gg authorization (found at bots webhook tab)
     * @param {Discord.Client} client Discord Client Object
     */
    constructor(Authorization, client) {
        const bot = this.getBot(client.user.id);
        if (!bot) throw new APIError('Bot has not been found in the Top.gg API, make sure your bot is public and/or you authorization key is correct.');
    };

    /**
     * 
     * @param {number | number[]} server_count The current server count of the bot
     * @param {number[]} shards The amount of guilds the bot is in for each shard
     * @param {number} shardId The current shard ID the bots posting stats from
     * @param {number} shard_count Amount of shards the bot has
     * @returns {Promise<void>} Promise<void>
     */
    async postStats(
        server_count,
        shards,
        shardId,
        shard_count
    ) {
        const url = this.enpointUrl(`bots/${this.client.user.id}/stats`);
        const body = JSON.stringify({
            server_count,
            shards,
            shardId,
            shard_count
        });

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: this.Authorization
                },
                body
            });

            if (res.ok) this.Events.emit("posted");
        } catch {
            this.Events.emit('error');
        }
    };

    /**
     * Fetches the bot's top.gg information
     * @param botId Bot's Discord Id (Application or User ID)
     * @returns top.gg Bot Object (Promise)
     */
    async getBot(botId) {
        const url = this.enpointUrl(`bots/${botId}`);
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: this.Authorization
                }
            }).then(res => res.json());

            return res;
        } catch {
            this.Events.emit('error');
        }
    };

    /**
     * Checks if its on weekend currently
     * @returns Promise<boolean>
     */
    async isWeekend() {
        const url = this.enpointUrl(`weekend`);

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: this.Authorization
                }
            }).then(res => res.json());

            return res.is_weekend;
        } catch {
            this.Events.emit('error');
        }
    };

    /**
     * Checks if user has voted for bot on TopGG via their user ID
     * @param {string} userId Discord User Id
     * @returns {Promise<boolean>} Promise<boolean>
     */
    async hasVoted(userId) {
        const url = this.enpointUrl(`bots/${this.client.user.id.toString()}/check?userId=${userId}`);

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: this.Authorization
                }
            }).then(res => res.json());

            if (res.voted)
                this.Events.emit("voted", userId)

            return res.voted;
        } catch {
            this.Events.emit('error');
        }
    };
};
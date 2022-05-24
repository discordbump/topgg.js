import Discord from 'discord.js';
import EventEmitter from 'events';
import fetch from 'node-fetch';

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "ApiError";
    }
};

interface IsWeekend {
    "is_weekend": boolean;
};

interface Bot {
    "defAvatar": string;
    "invite": string;
    "website": string;
    "support": string;
    "github": string;
    "longdesc": string;
    "shortdesc": string;
    "prefix": string;
    "lib": string;
    "clientid": string;
    "avatar": string;
    "id": string;
    "discriminator": string;
    "username": string;
    "date": string;
    "server_count": number;
    "shard_count": number;
    "guilds": string[];
    "shards": string[];
    "monthlyPoints": number;
    "points": number;
    "certifiedBot": boolean;
    "owners": string[];
    "tags": string[];
    "donatebotguildid": string;
};

interface UserVoted {
    voted: boolean
};

export default class TopGG {
    private getBase() {
        let url = this.base;
        if (
            !url.startsWith('https://') &&
            !url.startsWith('http://')
        ) url = 'https://' + url as string;
        if (!url.endsWith("/")) url += "/";
        return url as string;
    }

    private base = "https://top.gg/api"

    private enpointUrl(endpoint: string): string {
        return this.getBase() + endpoint as string;
    };

    private Events = new EventEmitter();

    public on = this.Events.on;


    /**
     * Create connection between API and your bot (has to be on Top.gg)
     * @param {string} Authorization Top.gg authorization (found at bots webhook tab)
     * @param {Discord.Client} client Discord Client Object
     */
    constructor(private Authorization: string, private client: Discord.Client) {
        const bot = this.getBot(client.user.id as string);
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
    public async postStats(
        server_count: number | number[],
        shards?: number[],
        shardId?: number,
        shard_count?: number
    ): Promise<void> {
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
                    Authorization: this.Authorization as string
                },
                body
            });

            this.Events.emit("posted");
        } catch {
            this.Events.emit('error')
        }
    };

    /**
     * Fetches the bot's top.gg information
     * @param botId Bot's Discord Id (Application or User ID)
     * @returns top.gg Bot Object (Promise)
     */
    public async getBot(botId: string): Promise<Bot> {
        const url = this.enpointUrl(`bots/${botId}`);

        const res: Bot = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: this.Authorization as string
            }
        }).then(res => res.json());

        return res;
    };

    /**
     * Checks if its on weekend currently
     * @returns Promise<boolean>
     */
    public async isWeekend(): Promise<boolean> {
        const url = this.enpointUrl(`weekend`);

        const res: IsWeekend = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: this.Authorization as string
            }
        }).then(res => res.json());

        return res.is_weekend;
    };

    /**
     * Checks if user has voted for bot on TopGG via their user ID
     * @param {string} userId Discord User Id
     * @returns {Promise<boolean>} Promise<boolean>
     */
    public async hasVoted(userId: string): Promise<boolean> {
        const url = this.enpointUrl(`bots/${this.client.user.id.toString()}/check?userId=${userId}`);

        const res: UserVoted = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: this.Authorization as string
            }
        }).then(res => res.json());

        if (res.voted)
            this.Events.emit("voted", userId)

        return res.voted;
    };
};
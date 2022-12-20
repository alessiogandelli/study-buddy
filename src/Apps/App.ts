import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram';
import RedisService from '../Services/RedisService';

export default abstract class App {

    protected bot: Telegraf;
    protected redis: RedisService;

    constructor(bot: Telegraf, redis: RedisService) {
        this.bot = bot;
        this.redis = redis;
    }

    public abstract startUser(userId: number, ctx: Context<Update>): Promise<void>;
    public abstract onCommand(userId: number, cmd: string, ctx: Context): Promise<void>;
    public abstract onText(userId: number, text: string, ctx: Context): Promise<void>;
}
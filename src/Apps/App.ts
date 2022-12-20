import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram';

export default abstract class App {

    protected bot: Telegraf;

    constructor(bot: Telegraf) {
        this.bot = bot;
    }

    public abstract startUser(userId: number, ctx: Context<Update>): Promise<void>;
    public abstract onCommand(userId: number, cmd: string, ctx: Context): Promise<void>;
    public abstract onText(userId: number, text: string, ctx: Context): Promise<void>;
}
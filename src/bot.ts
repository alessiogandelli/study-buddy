import { Context, Telegraf } from 'telegraf'
import { Keyboard, Key  } from 'telegram-keyboard'
import * as dotenv from 'dotenv'
import App from './Apps/App';
import Rememo from './Apps/Rememo';
import RedisService from './Services/RedisService';
import { Update } from 'telegraf/typings/core/types/typegram';


class StudyBot {
    private readonly bot: Telegraf;
    private readonly redisService: RedisService;
    private readonly apps: { [key: string]: App} = { };

    constructor() {
        dotenv.config()
        this.redisService = new RedisService();
        this.bot = new Telegraf(process.env.BOT_TOKEN ?? '');

        this.loadApps();
        this.commands();
        this.start();
    }

    public start() {
        this.bot.launch();
        process.once('SIGINT', () => this.stop('SIGINT'));
        process.once('SIGTERM', () => this.stop('SIGTERM'));
        console.log('Bot started')
    }

    public async stop(command: string) {
        console.log('Bot stopping...')
        this.bot.stop(command);
        await this.redisService.disconnect();
    }

    public loadApps() {
        this.apps[Rememo.appname] = new Rememo(this.bot);
    }

    public commands() {
        this.bot.start((ctx) => ctx.reply('Ciao'));
        this.bot.command('apps', (ctx) => this.listApps(ctx));
        this.bot.on('callback_query', (ctx) => this.selectApp(ctx));
        this.bot.command('currentApp', (ctx) => this.currentApp(ctx));
    }

    public async listApps(ctx: Context<Update>) {
        const keyboard = Keyboard.make([
            Object.keys(this.apps).map(x => Key.callback('Rememo', 'rememo'))
        ]).inline();

        return ctx.reply('Select an app', keyboard);
    }

    public async selectApp(ctx: Context<Update>) {
        const set = (ctx.callbackQuery as any)?.data;
        await ctx.answerCbQuery(set);

        if (this.apps[set] && ctx.from?.id) {
            await this.redisService.setUserSelectedApp(ctx.from.id, set);
            await this.apps[set].startUser(ctx.from.id, ctx);
        } else {
            await ctx.reply(`App ${set} not found`);
        }
    }

    public async currentApp(ctx: Context<Update>) {
        if (ctx.from?.id) {
            const app = await this.redisService.getUserSelectedApp(ctx.from.id);
            await ctx.reply(app ? `Current app is ${app}` : 'No app selected');
        }
    }

}

new StudyBot();
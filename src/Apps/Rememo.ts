import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram';
import App from './App';

export default class Rememo extends App {
    static readonly appname: string = 'rememo';

    public async startUser(userId: number, ctx: Context<Update>): Promise<void> {
        ctx.reply(`User ${userId} started Rememo`);
    }
    public async onCommand(userId: number, cmd: string, ctx: Context<Update>): Promise<void> {
        ctx.reply(`User ${userId} sent command ${cmd} to Rememo`);
    }
    public async onText(userId: number, text: string, ctx: Context<Update>): Promise<void> {
        ctx.reply(`User ${userId} sent text ${text} to Rememo`);
    }

}
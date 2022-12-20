import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram';
import { Keyboard } from 'telegram-keyboard';
import App from '../App';

export default class Rememo extends App {
    static readonly appname: string = 'rememo';

    public async startUser(userId: number, ctx: Context<Update>): Promise<void> {
        const selectedWordsSet = this.redis.client().get(`${userId}:rememo:wordsset`);
        if (!selectedWordsSet) {
            await ctx.reply('No words set selected');
        
        
            const keyboard = Keyboard.make([
            ]).inline();
    
            await ctx.reply('Select a set', keyboard);
        }



    }
    public async onCommand(userId: number, cmd: string, ctx: Context<Update>): Promise<void> {
        await ctx.reply(`User ${userId} sent command ${cmd} to Rememo`);
    }
    public async onText(userId: number, text: string, ctx: Context<Update>): Promise<void> {
        await ctx.reply(`User ${userId} sent text ${text} to Rememo`);
    }

}
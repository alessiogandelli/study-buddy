import { Telegraf } from 'telegraf'
import { Keyboard, Key  } from 'telegram-keyboard'
import Rememo from './rememo'
import * as dotenv from 'dotenv'
dotenv.config()


const rememo = new Rememo();

const bot = new Telegraf(process.env.BOT_TOKEN ?? '');
bot.start((ctx) => ctx.reply('Ciao'));
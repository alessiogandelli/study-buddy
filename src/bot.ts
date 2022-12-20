import { Telegraf, Context, Scenes, session } from 'telegraf'
import * as dotenv from 'dotenv'
import Rememo from './rememo';
import LocalSession from 'telegraf-session-local';

dotenv.config()

const rememo = new Rememo();
const bot = new Telegraf(process.env.BOT_TOKEN || '');
let i = 0;
const contactDataWizard = new Scenes.WizardScene(
  'GIOCA',
  (ctx) => {
      ctx.reply('Let\'s start the training!');
      const w = rememo.nextWord();
      (ctx.wizard.state as any).currentWordIndex = w.index;
      ctx.reply(`Next word [${w!.points.toPrecision(2)}]: <code>${w!.tr}</code>`, { parse_mode: 'HTML' });
      ctx.wizard.next();
  },
  (ctx) => {
    const answer = (ctx?.message as any)?.text;

    let [next, reply] = rememo.handleAnswer((ctx.wizard.state as any).currentWordIndex, answer);
    if (next) {
      const w = rememo.nextWord();
      (ctx.wizard.state as any).currentWordIndex = w.index;
      reply += `\n\nNext word [${w!.points.toPrecision(2)}]: <code>${w!.tr}</code>`;
    }
    ctx.reply(reply, { parse_mode: 'HTML' });
    ctx.wizard.selectStep(ctx.wizard.cursor);

  },
  (ctx) => {
      ctx.reply('Thank you for your replies, we\'ll contact your soon');
      return ctx.scene.leave();
  },
);


let stage = new Scenes.Stage( [ contactDataWizard as any ]);

bot.use((new LocalSession({ database: 'example_db.json' })).middleware())
bot.use(stage.middleware() as any);
bot.command('gioca', (ctx: any) => {
  ctx.scene.enter('GIOCA')
})

bot.launch();
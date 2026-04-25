const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8630888465:AAHFUBf03ycuglQOoLFMJZGEIyzutt5WWVg';
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🔐 CorruptStop SMS Bot ishga tushdi...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  // 1. Tasdiqlash kodi deep linki orqali kelsa
  if (text.startsWith('/start code_')) {
    const code = text.split('_')[1];
    return bot.sendMessage(chatId, `🔐 **CorruptStop Tasdiqlash Kodi**\n\nSizning kodingiz: \`${code}\` \n\nUshbu kodni saytdagi maydonchaga kiriting.`, { 
      parse_mode: 'Markdown',
      reply_markup: { remove_keyboard: true }
    });
  }

  // 2. Oddiy /start yoki boshqa xabarlar
  if (text === '/start' || text) {
    // Avval eski tugmalarni tozalash uchun yashirincha jo'natamiz
    await bot.sendMessage(chatId, 'Bosh menyu tozalanmoqda...', { reply_markup: { remove_keyboard: true } }).then(msg => {
      bot.deleteMessage(chatId, msg.message_id).catch(() => {});
    });

    return bot.sendMessage(chatId, '🛡 **CorruptStop — SMS Xizmati**\n\nAssalomu alaykum! Ushbu bot faqat saytimizda ro\'yxatdan o\'tish uchun kodlarni yetkazib beradi.\n\n🌐 **Shikoyat yuborish uchun saytimizga kiring:**\nhttp://localhost:5173', {
      reply_markup: {
        inline_keyboard: [[{ text: "🌐 Saytga o'tish", url: "https://corruptstop.uz" }]]
      },
      parse_mode: 'Markdown'
    });
  }
});

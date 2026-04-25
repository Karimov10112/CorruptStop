const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOKEN = '8451384929:AAH752DDOoeIlKbptrlxIQnkIYGBePi2eE4';
const bot = new TelegramBot(TOKEN, { polling: true });
const BACKEND_URL = 'http://localhost:3001/api/reports';

const userState = {};

console.log('🚀 Asosiy Shikoyat Boti (@corruptstop_bot) ishga tushdi...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  if (text === '/start' || text === 'Yangi shikoyat yuborish') {
    delete userState[chatId];
    return bot.sendMessage(chatId, '🛡 **CorruptStop — Asosiy Shikoyat Platformasi**\n\nQuyidagi tugmalardan birini tanlang:', {
      reply_markup: {
        keyboard: [['📝 Shikoyat berish'], ['🗺 Xaritadan ko\'rish']],
        resize_keyboard: true
      },
      parse_mode: 'Markdown'
    });
  }

  if (text === '🗺 Xaritadan ko\'rish') {
    return bot.sendMessage(chatId, '🌐 Barcha shikoyatlarni xaritada ko\'rish uchun saytimizga kiring:\nhttp://localhost:5173/map');
  }

  if (text === '📝 Shikoyat berish' || text === '🔄 Qayta yozish') {
    userState[chatId] = { step: 1 };
    return bot.sendMessage(chatId, '📂 **Qaysi sohada korrupsiya holatini kuzatdingiz?**', {
      reply_markup: {
        keyboard: [
          ['🏥 Sog\'liqni saqlash', '📚 Ta\'lim'],
          ['🏗️ Qurilish', '🛒 Davlat xaridlari'],
          ['🛣️ Yo\'l harakati', '🏠 Yer/Mulk'],
          ['⚖️ Adliya/Sud', '💰 Soliq'],
          ['⚽ Sport', '⚡ Kommunal xizmat'],
          ['👶 Ijtimoiy yordam', '💼 Mehnat'],
          ['🔒 Harbiy/Maxfiy', '📦 Boshqa']
        ],
        resize_keyboard: true
      }
    });
  }

  const state = userState[chatId];
  if (state && !text.startsWith('/')) {
    // 1-bosqich: Sohani tanlash
    if (state.step === 1) {
      state.category = text;
      state.step = 2;
      return bot.sendMessage(chatId, "📍 **Joylashuvni yuboring:**", {
        reply_markup: {
          keyboard: [[{ text: "📍 Joylashuvni yuborish", request_location: true }]],
          resize_keyboard: true
        }
      });
    }

    // 3-bosqich: Tavsif yozish
    if (state.step === 3) {
      state.description = text;
      state.step = 4;
      return bot.sendMessage(chatId, "📸 **Dalillar bormi?** (Rasm yuboring yoki quyidagidan tanlang):", {
        reply_markup: {
          keyboard: [['O\'tkazib yuborish']],
          resize_keyboard: true
        }
      });
    }

    // 5-bosqich: Ko'rib chiqish va Tasdiqlash
    if (text === 'O\'tkazib yuborish' && state.step === 4) {
      return showReview(chatId, state);
    }

    if (text === '✅ Tasdiqlash va Yuborish' && state.step === 5) {
      return sendReport(chatId, state);
    }
  }
});

bot.on('location', (msg) => {
  const chatId = msg.chat.id;
  if (userState[chatId] && userState[chatId].step === 2) {
    userState[chatId].location = { lat: msg.location.latitude, lng: msg.location.longitude };
    userState[chatId].step = 3;
    bot.sendMessage(chatId, "📝 **Batafsil tavsif yozing** (kamida 10 belgi):");
  }
});

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (userState[chatId] && userState[chatId].step === 4) {
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    userState[chatId].image = await bot.getFileLink(photoId);
    return showReview(chatId, userState[chatId]);
  }
});

function showReview(chatId, data) {
  data.step = 5;
  const summary = `👀 **Shikoyatingizni tekshiring:**\n\n` +
    `📂 **Soha:** ${data.category}\n` +
    `📝 **Tavsif:** ${data.description}\n` +
    `📍 **Joylashuv:** ${data.location.lat}, ${data.location.lng}\n` +
    `📸 **Rasm:** ${data.image ? '✅ Biriktirilgan' : '❌ Yo\'q'}`;

  bot.sendMessage(chatId, summary, {
    reply_markup: {
      keyboard: [['✅ Tasdiqlash va Yuborish'], ['🔄 Qayta yozish']],
      resize_keyboard: true
    },
    parse_mode: 'Markdown'
  });
}

async function sendReport(chatId, data) {
  try {
    const report = {
      id: Date.now(),
      category: data.category,
      description: data.description,
      location: data.location,
      image: data.image || null,
      status: 'pending',
      date: new Date().toISOString()
    };
    await axios.post(BACKEND_URL, report);
    bot.sendMessage(chatId, "✅ **Shikoyatingiz muvaffaqiyatli yuborildi!**\n\nU tekshirilgach xaritada paydo bo'ladi.", {
      reply_markup: {
        keyboard: [['Yangi shikoyat yuborish'], ['🗺 Xaritadan ko\'rish']],
        resize_keyboard: true
      }
    });
    delete userState[chatId];
  } catch (e) {
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
  }
}

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const aiAnalyzer = require('./services/ai_analyzer.cjs');

const TOKEN = '8451384929:AAH752DDOoeIlKbptrlxIQnkIYGBePi2eE4';
const bot = new TelegramBot(TOKEN, { polling: true });
const BACKEND_URL = 'http://localhost:3001/api/reports';

const userState = {};

process.on('uncaughtException', (err) => {
  console.error('🔥 CRITICAL ERROR:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
});

console.log('🚀 Asosiy Shikoyat Boti (@corruptstop_bot) ishga tushdi...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(`📩 XABAR KELDI [${chatId}]:`, text);
  if (!text) return;

  if (text === '/start' || text === 'Yangi shikoyat yuborish' || text === '📝 Shikoyat berish') {
    delete userState[chatId];
    userState[chatId] = { step: 1 };
    return bot.sendMessage(chatId, '📝 <b>Marhamat, muammoni batafsil bayon qiling:</b>\n\nSun\'iy intellekt tahlil qilib, uni tegishli sohaga o\'zi yo\'naltiradi.', {
      reply_markup: {
        keyboard: [['🔙 Bekor qilish']],
        resize_keyboard: true
      },
      parse_mode: 'HTML'
    });
  }

  if (text === '🔙 Bekor qilish') {
    delete userState[chatId];
    return bot.sendMessage(chatId, 'Asosiy menyu:', {
      reply_markup: {
        keyboard: [['📝 Shikoyat berish'], ['🗺 Xaritadan ko\'rish', '🏗 HokimWatch']],
        resize_keyboard: true
      }
    });
  }

  const state = userState[chatId];
  if (state && !text.startsWith('/')) {
    // 1-bosqich: AI Tahlili
    if (state.step === 1) {
      const waitMsg = await bot.sendMessage(chatId, '🔍 <b>Sun\'iy intellekt tahlil qilmoqda...</b>', { parse_mode: 'HTML' });
      
      try {
        const aiResult = await aiAnalyzer.analyzeComplaint(text);
        
        if (aiResult.status === 'invalid') {
          bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
          return bot.sendMessage(chatId, `❌ <b>AI RAD ETDI:</b>\n\n${aiResult.analysis}\n\nIltimos, aniqroq ma'lumot bering.`, { parse_mode: 'HTML' });
        }

        state.description = text;
        state.ai = aiResult;
        state.step = 2;

        bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
        return bot.sendMessage(chatId, 
          `✅ <b>Tahlil yakunlandi!</b>\n\n` +
          `📂 <b>Soha:</b> ${aiResult.category}\n` +
          `🏛 <b>Organ:</b> ${aiResult.organization}\n` +
          `⚖️ <b>Asos:</b> ${aiResult.legal_basis}\n\n` +
          `📍 Endi joylashuvni yuboring (Pastdagi tugmani bosing):`, {
          reply_markup: {
            keyboard: [[{ text: "📍 Joylashuvni yuborish", request_location: true }], ['🔙 Bekor qilish']],
            resize_keyboard: true
          },
          parse_mode: 'HTML'
        });
      } catch (err) {
        console.error('AI Bot Error:', err);
        bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
        return bot.sendMessage(chatId, "❌ AI tahlilida xatolik yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring.");
      }
    }

    // 3-bosqich: Rasm
    if (state.step === 3) {
      if (text === 'O\'tkazib yuborish') {
        return showReview(chatId, state);
      }
    }

    // 5-bosqich: Tasdiqlash
    if (text === '✅ Tasdiqlash va Yuborish' && state.step === 5) {
      return sendReport(chatId, state);
    }
    
    if (text === '🔄 Qayta yozish') {
      delete userState[chatId];
      return bot.sendMessage(chatId, "Matnni qaytadan yuboring:");
    }
  } else if (!text.startsWith('/')) {
    // HECH QANDAY STATUSDA BO'LMASA
    console.log(`📤 DEFAULT JAVOB YUBORILMOQDA [${chatId}]`);
    return bot.sendMessage(chatId, '🛡 <b>CorruptStop — Asosiy Shikoyat Platformasi</b>\n\nQuyidagi tugmalardan birini tanlang:', {
      reply_markup: {
        keyboard: [['📝 Shikoyat berish'], ['🗺 Xaritadan ko\'rish', '🏗 HokimWatch']],
        resize_keyboard: true
      },
      parse_mode: 'HTML'
    });
  }
});

bot.on('location', (msg) => {
  const chatId = msg.chat.id;
  if (userState[chatId] && userState[chatId].step === 2) {
    userState[chatId].location = { lat: msg.location.latitude, lng: msg.location.longitude };
    userState[chatId].step = 3;
    bot.sendMessage(chatId, "📸 <b>Dalillar bormi?</b> (Rasm yuboring yoki o'tkazib yuboring):", {
      reply_markup: {
        keyboard: [['O\'tkazib yuborish'], ['🔙 Bekor qilish']],
        resize_keyboard: true
      },
      parse_mode: 'HTML'
    });
  }
});

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (userState[chatId] && userState[chatId].step === 3) {
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    userState[chatId].image = await bot.getFileLink(photoId);
    return showReview(chatId, userState[chatId]);
  }
});

function showReview(chatId, data) {
  data.step = 5;
  const summary = `👀 <b>Ma'lumotlarni tekshiring:</b>\n\n` +
    `📂 <b>Soha:</b> ${data.ai.category}\n` +
    `🏛 <b>Organ:</b> ${data.ai.organization}\n` +
    `📝 <b>Tavsif:</b> ${data.description}\n` +
    `📍 <b>Joylashuv:</b> Biriktirildi\n` +
    `📸 <b>Dalil:</b> ${data.image ? '✅ Biriktirildi' : '❌ Yo\'q'}`;

  bot.sendMessage(chatId, summary, {
    reply_markup: {
      keyboard: [['✅ Tasdiqlash va Yuborish'], ['🔄 Qayta yozish']],
      resize_keyboard: true
    },
    parse_mode: 'HTML'
  });
}

async function sendReport(chatId, data) {
  try {
    const report = {
      description: data.description,
      sector: data.ai.category,
      organization: data.ai.organization,
      lat: data.location.lat,
      lng: data.location.lng,
      image: data.image || null,
      ai_analysis: data.ai
    };
    console.log('📤 Botdan shikoyat yuborilmoqda:', JSON.stringify(report, null, 2));
    await axios.post(BACKEND_URL, report);
    bot.sendMessage(chatId, "✅ <b>Shikoyatingiz qabul qilindi va AI tomonidan tasdiqlandi!</b>\n\nID: CS-" + Date.now(), {
      reply_markup: {
        keyboard: [['📝 Shikoyat berish'], ['🗺 Xaritadan ko\'rish']],
        resize_keyboard: true
      },
      parse_mode: 'HTML'
    });
    delete userState[chatId];
  } catch (e) {
    console.error('❌ Bot Send Error:', e.response?.data || e.message);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
  }
}

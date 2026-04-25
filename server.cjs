const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const twilio = require('twilio');
const redis = require('redis');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'reports.json');

const USERS_FILE = path.join(__dirname, 'users.json');
const MAIN_BOT_TOKEN = '8451384929:AAH752DDOoeIlKbptrlxIQnkIYGBePi2eE4'; // @corruptstop_bot tokeni
const ADMIN_CHAT_ID = 'SIZNING_CHAT_ID'; // Shikoyatlar boradigan joy (shaxsiy yoki guruh ID)

async function notifyMainBot(report) {
  try {
    const message = `🔔 **Yangi Shikoyat!**\n\n` +
      `📂 **Soha:** ${report.category}\n` +
      `📝 **Tavsif:** ${report.description}\n` +
      `📍 **Joylashuv:** ${report.location.lat}, ${report.location.lng}\n` +
      `📅 **Sana:** ${new Date(report.date).toLocaleString('uz-UZ')}`;
    
    await axios.post(`https://api.telegram.org/bot${MAIN_BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Botga yuborishda xatolik:', error.message);
  }
}

// Foydalanuvchilarni o'qish
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Foydalanuvchini saqlash
function saveUser(phone, data) {
  const users = readUsers();
  users[phone] = { ...users[phone], ...data };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Redis o'chirildi (Vaqtinchalik xotira ishlatiladi)
const tempOTPs = {}; 

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 1. OTP kod yuborish
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali kod
  
  // Ma'lumotni vaqtinchalik xotiraga yozamiz (5 daqiqa)
  tempOTPs[phone] = { code, expires: Date.now() + 300000 };

  console.log(`🔑 KOD YARATILDI [${phone}]: ${code}`);

  // Telegram linki uchun kodni qaytaramiz
  res.json({ success: true, code, message: 'Kod yaratildi' });
});

// 2. Parol bilan kirish
app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  const users = readUsers();
  const user = users[phone];

  if (!user) {
    return res.status(404).json({ success: false, message: 'Bu raqam ro\'yxatdan o\'tmagan. Iltimos, avval ro\'yxatdan o\'ting.' });
  }

  if (user.password === password) {
    res.json({ success: true, user: { phone, ...user } });
  } else {
    res.status(400).json({ success: false, message: 'Parol noto\'g\'ri' });
  }
});

// 3. Parol o'rnatish
app.post('/api/auth/set-password', async (req, res) => {
  const { phone, password, name } = req.body;
  console.log(`📝 PAROL O'RNATILMOQDA [${phone}]: ${name}`);
  saveUser(phone, { password, name: name || 'Foydalanuvchi', role: 'user', points: 0 });
  res.json({ success: true, message: 'Parol muvaffaqiyatli o\'rnatildi' });
});

// 4. OTP kodni tekshirish
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  console.log(`🧐 KOD TEKSHIRILMOQDA [${phone}]: ${code}`);
  
  const stored = tempOTPs[phone];
  const isValid = (stored && stored.code === code && stored.expires > Date.now()) || code === '111111'; // Demo uchun 111111

  if (isValid) {
    console.log(`✅ KOD TO'G'RI [${phone}]`);
    delete tempOTPs[phone];
    const users = readUsers();
    const existingUser = users[phone];
    
    res.json({ 
      success: true, 
      isNewUser: !existingUser || !existingUser.password,
      user: existingUser || { phone, name: 'Foydalanuvchi', role: 'user', points: 0 }
    });
  } else {
    console.log(`❌ KOD XATO [${phone}]`);
    res.status(400).json({ success: false, message: 'Kod noto\'g\'ri yoki muddati o\'tgan' });
  }
});

// Fayldan o'qish
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return [{ id: 1, lat: 41.2995, lng: 69.2401, sector: 'health', location: 'Toshkent, Yunusobod', description: 'Tizim ishga tushdi', date: '2026-04-24', status: 'verified' }];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Faylga yozish
function saveData(reports) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));
}

// Saytdan yoki Botdan yangi shikoyat qabul qilish
app.post('/api/reports', (req, res) => {
  const reports = readData();
  const newReport = {
    ...req.body,
    id: `CS-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  reports.unshift(newReport);
  saveData(reports);
  console.log('✅ Yangi shikoyat tushdi va faylga saqlandi:', newReport.id);
  res.status(201).json(newReport);
});

// Barcha shikoyatlarni saytga berish
app.get('/api/reports', (req, res) => {
  res.json(readData());
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server ishga tushdi: http://localhost:${PORT}`);
});

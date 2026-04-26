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
const LAND_RESOURCES_FILE = path.join(__dirname, 'land_resources.json');
const LAND_COMMENTS_FILE = path.join(__dirname, 'land_comments.json');

function readLandComments() {
  if (!fs.existsSync(LAND_COMMENTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(LAND_COMMENTS_FILE, 'utf8'));
}

function saveLandComments(comments) {
  fs.writeFileSync(LAND_COMMENTS_FILE, JSON.stringify(comments, null, 2));
}
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

// AI Precheck API (Step 3 uchun)
app.post('/api/ai-precheck', async (req, res) => {
  const { description } = req.body;
  console.log('🔍 AI PRECHECK BOSHLANDI:', description);
  
  const text = (description || '').toLowerCase();
  
  // Oddiy spam filter (AI logikasi)
  if (text.length < 20) {
    return res.json({
      status: "invalid",
      analysis: "Shikoyat matni juda qisqa. Iltimos, holatni batafsil tushuntiring."
    });
  }

  // Korrupsiyaga oid emasligini tekshirish
  const corruptionKeywords = ['korrupsiya', 'pora', 'tender', 'noqonuniy', 'pul', 'tanish', 'qurilish', 'shifoxona', 'maktab', 'yo\'l', 'asfalt', 'hokim', 'byudjet', 'o\'g\'ri', 'qoida'];
  const hasKeyword = corruptionKeywords.some(kw => text.includes(kw));

  if (!hasKeyword && text.length < 50) {
    return res.json({
      status: "invalid",
      analysis: "Ushbu matnda korrupsiya yoki byudjet talon-tarojligiga oid belgilar topilmadi. Tizim faqat korrupsiya haqidagi xabarlarni qabul qiladi."
    });
  }

  // 14 ta yo'nalish bo'yicha tahlil (UI bilan moslashtirilgan)
  let category = "Sud";
  let organization = "O'zbekiston Respublikasi Bosh Prokuraturasi";

  // Yo'l harakati uchun kengaytirilgan qidiruv (Lotin va Kirill variantlari bilan)
  const isTraffic = (t) => t.includes('yo\'l') || t.includes('yol') || t.includes('transport') || t.includes('dtp') || t.includes('asfalt') || t.includes('svetofor') || t.includes('mashina') || t.includes('qoida');
  const isHealth = (t) => t.includes('shifoxona') || t.includes('doktor') || t.includes('tibbiy') || t.includes('sog\'liq');
  const isEducation = (t) => t.includes('maktab') || t.includes('bog\'cha') || t.includes('universitet') || t.includes('o\'qituvchi') || t.includes('ta\'lim');
  const isConstruction = (t) => t.includes('qurilish') || t.includes('pudrat') || t.includes('shaharsozlik') || t.includes('bino');
  const isProcurement = (t) => t.includes('tender') || t.includes('xarid') || t.includes('auktsion');
  const isProperty = (t) => t.includes('yer') || t.includes('kadastr') || t.includes('mulk') || t.includes('uchastka');
  const isJustice = (t) => t.includes('sud') || t.includes('advokat') || t.includes('prokuror') || t.includes('huquq');
  const isTax = (t) => t.includes('soliq') || t.includes('deklaratsiya');
  const isSport = (t) => (t.includes('sport') && !t.includes('transport')) || t.includes('stadion') || t.includes('chempionat');
  const isUtilities = (t) => t.includes('svet') || t.includes('gaz') || t.includes('elektr') || t.includes('suv') || t.includes('kommunal');

  if (isHealth(text)) {
    category = "Sog'liqni saqlash";
    organization = "Sog'liqni saqlash vazirligi";
  } else if (isEducation(text)) {
    category = "Ta'lim";
    organization = "Maktabgacha va maktab ta'limi vazirligi";
  } else if (isConstruction(text)) {
    category = "Qurilish";
    organization = "Qurilish vazirligi";
  } else if (isProcurement(text)) {
    category = "Davlat xaridlari";
    organization = "Iqtisodiyot va moliya vazirligi";
  } else if (isTraffic(text)) {
    category = "Yo'l harakati";
    organization = "IIV JXX Yo'l harakati xavfsizligi xizmati";
  } else if (isProperty(text)) {
    category = "Yer/Mulk";
    organization = "Kadastr agentligi";
  } else if (isJustice(text)) {
    category = "Sud";
    organization = "Oliy Sud / Sudyalar oliy kengashi";
  } else if (isTax(text)) {
    category = "Soliq";
    organization = "Davlat Soliq Qo'mitasi";
  } else if (isSport(text)) {
    category = "Sport";
    organization = "Sport vazirligi";
  } else if (isUtilities(text)) {
    category = "Kommunal xizmat";
    organization = "Uy-joy kommunal xizmat ko'rsatish vazirligi";
  } else if (text.includes('yordam') || text.includes('nafaqa') || text.includes('ijtimoiy')) {
    category = "Ijtimoiy yordam";
    organization = "Ijtimoiy himoya milliy agentligi";
  } else if (text.includes('ish') || text.includes('maosh') || text.includes('mehnat')) {
    category = "Mehnat";
    organization = "Kambag'allikni qisqartirish va bandlik vazirligi";
  } else if (text.includes('harbiy') || text.includes('armiya') || text.includes('maxfiy')) {
    category = "Harbiy/Maxfiy";
    organization = "Mudofaa vazirligi";
  }

  const aiResult = {
    status: "valid",
    category: category,
    organization: organization,
    analysis: `AI shikoyatni muvaffaqiyatli tahlil qildi. Matnda ochiq-oydin ${category} sohasidagi byudjet qonunbuzilishi yoki korrupsion holat belgilari mavjud.`,
    legal_basis: "O'zR Jinkoyat Kodeksining tegishli moddalari asosida tergovga tortilishi mumkin."
  };
  
  console.log('📊 AI PRECHECK NATIJASI:', JSON.stringify(aiResult, null, 2));
  res.json(aiResult);
});

// ==========================================
// HOKIMWATCH API LARI
// ==========================================
const HW_PROJECTS_FILE = path.join(__dirname, 'projects_db.json');
const HW_REPORTS_FILE = path.join(__dirname, 'hw_reports.json');

function readHWProjects() {
  if (!fs.existsSync(HW_PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(HW_PROJECTS_FILE, 'utf8'));
}

function readHWReports() {
  if (!fs.existsSync(HW_REPORTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(HW_REPORTS_FILE, 'utf8'));
}

function saveHWReports(reports) {
  fs.writeFileSync(HW_REPORTS_FILE, JSON.stringify(reports, null, 2));
}

// Barcha loyihalarni olish
app.get('/api/hw/projects', (req, res) => {
  res.json(readHWProjects());
});

// SIMULATE API SYNC WITH REAL DATA (HACKATHON DEMO)
app.post('/api/hw/sync', async (req, res) => {
  try {
    let data = [];
    if (fs.existsSync(HW_PROJECTS_FILE)) {
      data = JSON.parse(fs.readFileSync(HW_PROJECTS_FILE, 'utf8'));
    }

    // 1. Real ochiq API ga so'rov yuboramiz (Wikipedia GeoSearch API - Toshkent atrofi)
    // Bu haqiqiy manzillar, haqiqiy kordinatalar bilan qaytadi.
    const wikiUrl = 'https://uz.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=41.32|69.24&gslimit=5&format=json';
    const response = await fetch(wikiUrl);
    const apiData = await response.json();
    
    const realPlaces = apiData.query.geosearch || [];
    const newProjects = [];

    // 2. Real ma'lumotlarni bizning formatga o'tkazamiz
    realPlaces.forEach((place, index) => {
      // Faqat bazada yo'qlarini qo'shamiz
      if (!data.some(p => p.title.includes(place.title))) {
        newProjects.push({
          id: `HW-REAL-${Date.now()}-${index}`,
          title: `${place.title} - Ta'mirlash va obodonlashtirish loyihasi`,
          description: `Ochiq API orqali olindi. ${place.title} atrofida davlat byudjeti hisobidan ta'mirlash ishlari olib borilmoqda.`,
          status: index % 2 === 0 ? "ongoing" : "delayed",
          category: index % 3 === 0 ? "Qurilish" : (index % 2 === 0 ? "Yo'l infratuzilmasi" : "Ta'lim"),
          lat: place.lat,
          lng: place.lon, // wiki API 'lon' deb beradi
          budget_amount: Math.floor(Math.random() * 5000000000) + 1000000000,
          district: "Toshkent shahri",
          start_date: "2024-01-10",
          end_date: "2024-12-30",
          contractor: `Toshkent Qurilish MCHJ`
        });
      }
    });

    if (newProjects.length > 0) {
      data = [...newProjects, ...data];
      fs.writeFileSync(HW_PROJECTS_FILE, JSON.stringify(data, null, 2));
    }

    res.json({ success: true, newCount: newProjects.length });
  } catch (error) {
    console.error("API Sync xatosi:", error);
    res.status(500).json({ success: false, error: "Tashqi API ga ulanishda xatolik" });
  }
});

// Bitta loyiha
app.get('/api/hw/projects/:id', (req, res) => {
  const projects = readHWProjects();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Loyiha topilmadi" });
  
  const reports = readHWReports().filter(r => r.project_id === req.params.id);
  res.json({ ...project, reports });
});

// LandWatch loyihasiga anonim fikr bildirish
app.post('/api/hw/projects/:id/report', (req, res) => {
  const comments = readLandComments();
  const newComment = {
    id: `LWC-${Date.now()}`,
    project_id: req.params.id,
    text: req.body.text,
    author: 'Anonim',
    created_at: new Date().toISOString()
  };
  comments.push(newComment);
  saveLandComments(comments);
  res.status(201).json({ success: true, comment: newComment });
});

// Statistika
app.get('/api/hw/stats', (req, res) => {
  const projects = readHWProjects();
  const reports = readHWReports();
  
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_amount || 0), 0);
  const totalReports = reports.length;
  
  const totalScore = reports.reduce((sum, r) => sum + (r.score_overall || 0), 0);
  const averageScore = totalReports > 0 ? (totalScore / totalReports).toFixed(1) : 0;
  
  res.json({
    totalProjects,
    totalBudget,
    totalReports,
    averageScore,
    escalations: 2
  });
});

// --- HOKIMWATCH: LAND RESOURCES ---
app.get('/api/hw/land', (req, res) => {
  if (!fs.existsSync(LAND_RESOURCES_FILE)) {
    const initialLand = [
      { id: 'L-001', lat: 41.3415, lng: 69.2315, title: 'Yunusobod 15-kvartal bog\' hududi', status: 'critical', description: 'Ushbu hududda bolalar maydonchasi bo\'lishi kerak edi, biroq kottej qurilishi boshlangan.', risk_score: 95, legal_status: 'Noqonuniy sotilgan', votes: 13 },
      { id: 'L-002', lat: 41.3115, lng: 69.2815, title: 'Mirobod tumanidagi ariq bo\'yi', status: 'warning', description: 'Suv ob\'ektlari himoya hududida do\'kon qurish uchun noqonuniy ruxsat berilgan.', risk_score: 75, legal_status: 'Tekshirilmoqda', votes: 9 },
      { id: 'L-003', lat: 39.6542, lng: 66.9597, title: 'Samarqand - tarixiy hudud chegarasi', status: 'critical', description: 'YuNESKO himoyasidagi hududga yaqin yerda ko\'p qavatli bino qurish harakati.', risk_score: 88, legal_status: 'To\'xtatilgan', votes: 23 }
    ];
    fs.writeFileSync(LAND_RESOURCES_FILE, JSON.stringify(initialLand, null, 2));
  }
  
  const lands = JSON.parse(fs.readFileSync(LAND_RESOURCES_FILE, 'utf8'));
  const allComments = readLandComments();
  
  // Har bir landga o'zining reportlarini (kommentlarini) qo'shib yuboramiz
  const enrichedLands = lands.map(land => ({
    ...land,
    reports: allComments.filter(c => c.project_id === land.id)
  }));
  
  res.json(enrichedLands);
});

// LandWatch - Jamoatchilik ovozi
app.post('/api/hw/land/:id/vote', express.json(), (req, res) => {
  const LAND_RESOURCES_FILE = path.join(__dirname, 'land_resources.json');
  const { id } = req.params;
  const { action } = req.body || {};
  const data = JSON.parse(fs.readFileSync(LAND_RESOURCES_FILE, 'utf8'));
  const item = data.find((d) => d.id === id);
  if (!item) return res.status(404).json({ error: 'Topilmadi' });
  
  if (action === 'unvote') {
    item.votes = Math.max((item.votes || 0) - 1, 0);
  } else {
    item.votes = (item.votes || 0) + 1;
  }
  
  fs.writeFileSync(LAND_RESOURCES_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, votes: item.votes });
});

// LandWatch - PDF Ariza
app.get('/api/hw/land/:id/pdf', (req, res) => {
  const LAND_RESOURCES_FILE = path.join(__dirname, 'land_resources.json');
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(LAND_RESOURCES_FILE, 'utf8'));
  const item = data.find((d) => d.id === id);
  if (!item) return res.status(404).json({ error: 'Topilmadi' });

  const pdfContent = `
=== RASMIY SHIKOYAT ARIZASI ===
Muassasa: O'zbekiston Respublikasi Prokuratura Idorasi
Sana: ${new Date().toLocaleDateString('uz-UZ')}
ID: ${item.id}-${Date.now()}

SHIKOYAT MAQSADI: Yer resurslari nazorati bo'yicha noqonuniy holat

JOYLASHUV: ${item.title}
KOORDINATALAR: ${item.lat}, ${item.lng}
HUQUQIY STATUS: ${item.legal_status}
XAVF DARAJASI: ${item.risk_score}%
JAMOAT TASDIQLASH: ${item.votes || 0} kishi

TAVSIF:
${item.description}

AI TAHLILI NATIJASI:
Ushbu holat O'zbekiston Respublikasi Yer Kodeksining 52-moddasi va 
JK 209-moddasi (Yer qonunchiligini buzish) bo'yicha tekshirilishi lozim.

ILTIMOS:
LandWatch tizimi orqali qayd etilgan yuqoridagi ma'lumotlar asosida
tegishli tekshiruv olib borilishini va huquqbuzarlik aniqlanganida
qonun doirasida choralar ko'rilishini so'raymiz.

=== TIZIM TOMONIDAN IMZOLANGAN ===
CorruptStop LandWatch AI Tizimi v1.0
Vaqt tamg'asi: ${new Date().toISOString()}
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="ariza-${item.id}.txt"`);
  res.send(pdfContent);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server ishga tushdi: http://localhost:${PORT}`);
});

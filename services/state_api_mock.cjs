const fs = require('fs');
const path = require('path');
const blockchain = require('./blockchain.cjs');

const HW_PROJECTS_FILE = path.join(__dirname, '..', 'hw_projects.json');

// MOCK: Ochiq Byudjet va Davlat Xaridlari API sidan keluvchi ob'ekt
const mockStateData = [
  {
    id: "HW-2026-003",
    title: "Buxoro viloyati, G'ijduvon tumani markaziy shifoxonasini ta'mirlash",
    description: "Markaziy shifoxona 1-bino tomi va isitish tizimi.",
    category: "health",
    region: "Buxoro viloyati",
    district: "G'ijduvon tumani",
    budget_amount: 3200000000,
    budget_spent: 1500000000,
    contractor: "Buxoro Qurilish Maxsus MChJ",
    start_date: "2026-02-01",
    end_date: "2026-08-01",
    actual_end_date: null,
    lat: 40.1031,
    lng: 64.6775,
    address: "G'ijduvon tumani, Ibn Sino ko'chasi",
    status: "ongoing",
    before_photos: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    ],
    created_at: new Date().toISOString()
  }
];

function syncWithStateAPI() {
  console.log("🔄 Davlat API lari bilan sinxronizatsiya qilinmoqda...");
  
  let projects = [];
  if (fs.existsSync(HW_PROJECTS_FILE)) {
    projects = JSON.parse(fs.readFileSync(HW_PROJECTS_FILE, 'utf8'));
  }

  let added = 0;
  mockStateData.forEach(mockItem => {
    if (!projects.find(p => p.id === mockItem.id)) {
      projects.push(mockItem);
      added++;
      // Blockchain'ga yozamiz
      blockchain.addBlock({
        action: "STATE_API_SYNC",
        project_id: mockItem.id,
        details: `Loyiha Davlat API orqali avtomatik qo'shildi.`
      });
    }
  });

  if (added > 0) {
    fs.writeFileSync(HW_PROJECTS_FILE, JSON.stringify(projects, null, 2));
    console.log(`✅ ${added} ta yangi loyiha Davlat API dan yuklandi va Blockchain'ga yozildi.`);
  } else {
    console.log("✅ Yangi ma'lumot yo'q.");
  }
}

module.exports = { syncWithStateAPI };

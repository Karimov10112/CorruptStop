const fs = require('fs');
const blockchain = require('./blockchain.cjs');

function checkTriangulation(project, reports) {
  // 1. Davlat API: project.budget_spent / project.budget_amount
  const stateProgress = (project.budget_spent / project.budget_amount) * 100;
  
  // 2. Fuqaro xulosasi
  if (!reports || reports.length === 0) return { status: 'ongoing', triggers: [] };
  
  const incompleteReports = reports.filter(r => r.is_completed === 'no' || r.is_completed === 'partial').length;
  const citizenDoubtRate = (incompleteReports / reports.length) * 100;

  // 3. Sun'iy yo'ldosh (Mock - Sentinel-2 AI xulosasi)
  // Agar Davlat 80% dan ko'p pul sarflagan bo'lsa, lekin yo'ldosh "Fundament" desa...
  const satelliteProgress = 30; // Mock: Har doim 30% qurilgan deb faraz qilamiz

  const triggers = [];

  if (stateProgress > 80 && satelliteProgress < 40) {
    triggers.push("Mablag' sarflangan, lekin fiziki ishlar bajarilmagan (Sun'iy yo'ldosh tasdig'i).");
  }

  if (citizenDoubtRate > 60 && reports.length >= 2) {
    triggers.push("Fuqarolarning aksariyati ishlar bajarilmaganini aytmoqda.");
  }

  if (triggers.length >= 1) {
    // Blockchain'ga eskalatsiya yozamiz
    blockchain.addBlock({
      action: "AUTO_ESCALATION",
      project_id: project.id,
      triggers: triggers,
      timestamp: new Date().toISOString()
    });

    return {
      status: 'escalated',
      triggers: triggers
    };
  }

  return { status: project.status, triggers: [] };
}

module.exports = { checkTriangulation };

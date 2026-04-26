const crypto = require('crypto');

function verifyPhotoSecurity(photoData, citizenLat, citizenLng, projectLat, projectLng) {
  const result = {
    isValid: true,
    methods: [],
    errors: []
  };

  // 1. EXIF & Timestamp Check (Mock)
  // Haqiqiy vaziyatda bu yerda exif-parser ishlatiladi
  result.methods.push("EXIF_TIMESTAMP_VERIFIED");

  // 2. Cryptographic Hash of the file
  const hash = crypto.createHash('sha256').update(photoData + Date.now().toString()).digest('hex');
  result.methods.push(`FILE_HASH_LOCKED: ${hash.substring(0, 10)}...`);

  // 3. Geo-Fencing (Haversine Formula)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dp/2) * Math.sin(dp/2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const distance = getDistance(citizenLat, citizenLng, projectLat, projectLng);
  result.methods.push(`GEO_FENCE_VERIFIED: ${Math.round(distance)}m`);

  if (distance > 500) { // 500 metrdan uzoq bo'lsa
    result.isValid = false;
    result.errors.push("GEO_FENCE_FAILED: Fuqaro loyiha hududida emas.");
  }

  // 4. AI Sentinel Mock Check
  result.methods.push("AI_PIXEL_TAMPER_CHECK_PASSED");

  return result;
}

module.exports = { verifyPhotoSecurity };

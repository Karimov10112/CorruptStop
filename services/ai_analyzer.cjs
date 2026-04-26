const axios = require('axios');
require('dotenv').config();

// OpenAI API sozlamalari
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Fuqaro shikoyatini AI orqali tahlil qilish
 */
/**
 * Fuqaro shikoyatini AI orqali tahlil qilish, sohani aniqlash va validatsiya
 */
async function analyzeComplaint(description, manualCategory = 'other') {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    console.log('⚠️ AI API KEY topilmadi, simulyatsiya rejimida.');
    
    const text = (description || '').toLowerCase();
    let category = "Sud";
    let organization = "O'zbekiston Respublikasi Bosh Prokuraturasi";

    const isTraffic = (t) => t.includes('yo\'l') || t.includes('yol') || t.includes('transport') || t.includes('dtp') || t.includes('asfalt') || t.includes('svetofor') || t.includes('mashina') || t.includes('qoida');
    const isHealth = (t) => t.includes('shifoxona') || t.includes('doktor') || t.includes('tibbiy') || t.includes('sog\'liq');
    const isEducation = (t) => t.includes('maktab') || t.includes('bog\'cha') || t.includes('universitet') || t.includes('o\'qituvchi') || t.includes('ta\'lim');
    const isConstruction = (t) => t.includes('qurilish') || t.includes('pudrat') || t.includes('shaharsozlik') || t.includes('bino');
    const isSport = (t) => (t.includes('sport') && !t.includes('transport')) || t.includes('stadion') || t.includes('chempionat');

    if (isHealth(text)) {
      category = "Sog'liqni saqlash";
      organization = "Sog'liqni saqlash vazirligi";
    } else if (isEducation(text)) {
      category = "Ta'lim";
      organization = "Maktabgacha va maktab ta'limi vazirligi";
    } else if (isConstruction(text)) {
      category = "Qurilish";
      organization = "Qurilish vazirligi";
    } else if (isTraffic(text)) {
      category = "Yo'l harakati";
      organization = "IIV JXX Yo'l harakati xavfsizligi xizmati";
    } else if (isSport(text)) {
      category = "Sport";
      organization = "Sport vazirligi";
    }

    return {
      status: "verified",
      category: category,
      organization: organization,
      analysis: `AI (Simulyatsiya) shikoyatni tahlil qildi: ${category} sohasidagi holat.`,
      legal_basis: "O'zbekiston Respublikasi 'Murojaatlar to'g'risida'gi Qonuni."
    };
  }

  try {
    const text = (description || '').toLowerCase();
    const corruptionKeywords = ['korrupsiya', 'pora', 'tender', 'noqonuniy', 'pul', 'tanish', 'qurilish', 'shifoxona', 'maktab', 'yo\'l', 'asfalt', 'hokim', 'byudjet', 'o\'g\'ri', 'qoida', 'yopdi', 'berdim', 'so\'radi'];
    const hasKeyword = corruptionKeywords.some(kw => text.includes(kw));

    const prompt = `Siz O'zbekiston Respublikasining aksilkorrupsiya qonunchiligi bo'yicha yuqori malakali ekspert AI siz. 
    
    SIZNING BILIMLAR BAZANGIZ (STANDARTLAR):
    1. Poraxo'rlik: Mansabdor shaxsning o'z xizmat vazifasini bajarishi uchun moddiy manfaat talab qilishi yoki taklif qilinishi (pul bilan yopish).
    2. Rastrata va O'g'rilik: Davlat byudjeti (qurilish, xaridlar, yo'llar) mablag'larining maqsadsiz ishlatilishi.
    3. Nepotizm: Qarindosh-urug'chilik asosida imtiyozlar berish yoki javobgarlikdan qochish.
    4. Mansab vakolatini suiste'mol qilish: Shaxsiy manfaat yo'lida davlat resurslaridan foydalanish yoki qonunni chetlab o'tish.
    5. HokimWatch Standarti: Qurilish va infratuzilma loyihalaridagi sifatsizlik.

    MUHIM: Agar matnda yuqoridagi holatlarga hatto kichik ishora bo'lsa ham (masalan: "pul bilan yopdi", "berdim", "tanishi bor"), uni "valid" deb qabul qiling. Faqatgina umuman aloqasi bo'lmagan matnlarni (salomlashish, havo haqida va h.k.) "invalid" deb qaytaring.

    Shikoyat matni: "${description}"

    Javobni FAQAT JSON formatda bering:
    {
      "status": "valid",
      "category": "tanlangan_soha_nomi",
      "organization": "mas'ul_tashkilot_nomi",
      "analysis": "shikoyatning qisqa tahlili",
      "legal_basis": "buzilayotgan bo'lishi mumkin bo'lgan qonun nomi"
    }`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Siz O'zbekiston aksilkorrupsiya qonunchiligi ekspertisiz. Har qanday shubhali holatni, ayniqsa 'pul bilan yopish' yoki 'pora' bilan bog'liq gaplarni jiddiy qabul qiling. O'zbek tilida javob bering." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    
    // Agar AI adashib invalid desa, lekin bizda kalit so'z bo'lsa - majburan valid qilamiz
    if (result.status === 'invalid' && hasKeyword) {
      result.status = 'valid';
      result.analysis = "Tizim kalit so'zlar asosida korrupsion holatni aniqladi.";
    }
    
    return result;
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return {
      status: "error",
      category: manualCategory,
      organization: "Noma'lum",
      analysis: "AI tahlili vaqtida xatolik yuz berdi.",
      legal_basis: "Noma'lum"
    };
  }
}

module.exports = { analyzeComplaint };

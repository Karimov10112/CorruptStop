const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const LEDGER_FILE = path.join(__dirname, '..', 'audit_ledger.json');

// Initialize ledger if it doesn't exist
if (!fs.existsSync(LEDGER_FILE)) {
  const genesisBlock = {
    index: 0,
    timestamp: new Date().toISOString(),
    data: "Genesis Block - HokimWatch Initialized",
    previousHash: "0",
    hash: ""
  };
  genesisBlock.hash = crypto.createHash('sha256').update(JSON.stringify(genesisBlock)).digest('hex');
  fs.writeFileSync(LEDGER_FILE, JSON.stringify([genesisBlock], null, 2));
}

function getLedger() {
  return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8'));
}

function addBlock(data) {
  const ledger = getLedger();
  const previousBlock = ledger[ledger.length - 1];
  
  const newBlock = {
    index: ledger.length,
    timestamp: new Date().toISOString(),
    data: data,
    previousHash: previousBlock.hash,
    hash: ""
  };
  
  newBlock.hash = crypto.createHash('sha256').update(JSON.stringify(newBlock)).digest('hex');
  ledger.push(newBlock);
  
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2));
  return newBlock;
}

function verifyChain() {
  const ledger = getLedger();
  for (let i = 1; i < ledger.length; i++) {
    const currentBlock = ledger[i];
    const previousBlock = ledger[i - 1];
    
    // Hashni qayta hisoblaymiz
    const blockToVerify = { ...currentBlock, hash: "" };
    const calculatedHash = crypto.createHash('sha256').update(JSON.stringify(blockToVerify)).digest('hex');
    
    if (currentBlock.hash !== calculatedHash) return false;
    if (currentBlock.previousHash !== previousBlock.hash) return false;
  }
  return true;
}

module.exports = { addBlock, getLedger, verifyChain };

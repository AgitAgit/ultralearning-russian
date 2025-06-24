const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function pdfToString(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to convert PDF to string.');
  }
}

module.exports = { pdfToString };
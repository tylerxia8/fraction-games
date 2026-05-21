const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const dir = __dirname;
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.pdf'));

(async () => {
  for (const f of files) {
    const buf = fs.readFileSync(path.join(dir, f));
    const parser = new PDFParse({ data: buf });
    const data = await parser.getText();
    console.log('===== ' + f + ' =====');
    console.log(data.text);
    console.log('\n');
  }
})();

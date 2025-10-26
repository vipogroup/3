
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const sizes = [192, 512];
sizes.forEach(sz => {
  const p = path.join(dir, `${sz}.png`);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, Buffer.from([]));
  }
});
console.log("Postinstall done 2025-10-26T01:18:40.124218");

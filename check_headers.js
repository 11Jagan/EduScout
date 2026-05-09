const XLSX = require('xlsx');

function checkFile(filename) {
  console.log(`\n--- Checking ${filename} ---`);
  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  for(let i=0; i<4; i++){
    console.log(`Row ${i}:`, JSON.stringify(data[i]));
  }
}

checkFile('College-Affiliated College.xlsx');

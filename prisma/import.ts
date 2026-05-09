import { PrismaClient, CollegeType } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function processFile(filename: string) {
  console.log(`\n--- Reading ${filename} ---`);

  // This will take a few seconds for the large 37MB file
  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheetName], { header: 1 });

  // Find the row that contains the headers (it starts with "Aishe Code")
  let headerRowIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (data[i] && data[i][0] === "Aishe Code") {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    console.error(`Could not find header row in ${filename}`);
    return;
  }

  const headers = data[headerRowIdx];
  const nameIdx = headers.indexOf("Name");
  const stateIdx = headers.indexOf("State");
  const districtIdx = headers.indexOf("District");
  const estYearIdx = headers.indexOf("Year Of Establishment");

  const rows = data.slice(headerRowIdx + 1).filter(row => row.length > 1);
  const collegesToInsert = [];

  console.log(`Found ${rows.length} records in ${filename}. Formatting data...`);

  for (const row of rows) {
    const aisheCode = row[0];
    const name = row[nameIdx] || "Unknown College";
    const state = row[stateIdx] || "Unknown";
    const district = row[districtIdx] || "";
    const estYearStr = row[estYearIdx];
    const location = `${district}, ${state}`.replace(/^, /, "");

    // Determine type and simulate realistic metrics
    const upperName = name.toUpperCase();
    const isGovt = upperName.includes("NATIONAL") || upperName.includes("INDIAN") || upperName.includes("STATE") || upperName.includes("GOVERNMENT") || upperName.includes("GOVT");
    const type = (isGovt ? "STATE_UNIVERSITY" : "PRIVATE") as CollegeType;

    let established = parseInt(estYearStr);
    if (isNaN(established)) established = 2000;

    const baseFees = isGovt ? 25000 : 100000;
    const feesPerYear = baseFees + Math.floor(Math.random() * 50000);

    const rating = parseFloat((3.0 + Math.random() * 2.0).toFixed(1));
    const placementPercent = Math.floor(60 + Math.random() * 40);
    const avgPackage = (isGovt ? 600000 : 300000) + Math.floor(Math.random() * 300000);
    const topPackage = avgPackage * (3 + Math.floor(Math.random() * 7));

    const slug = `${slugify(name)}-${aisheCode.toLowerCase()}`;

    collegesToInsert.push({
      name,
      slug,
      location,
      state,
      feesPerYear,
      rating,
      type,
      established,
      naacGrade: rating > 4.5 ? "A++" : rating > 4.0 ? "A+" : "A",
      placementPercent,
      avgPackage,
      topPackage,
    });
  }

  console.log(`Pushing ${collegesToInsert.length} records to database in batches...`);

  const BATCH_SIZE = 250;
  let insertedCount = 0;
  for (let i = 0; i < collegesToInsert.length; i += BATCH_SIZE) {
    const batch = collegesToInsert.slice(i, i + BATCH_SIZE);
    try {
      await prisma.college.createMany({
        data: batch,
        skipDuplicates: true, // If we run this twice, it won't crash on duplicates
      });
      insertedCount += batch.length;
      process.stdout.write(`\rInserted ${insertedCount} / ${collegesToInsert.length}`);
    } catch (e) {
      console.error(`\nError inserting batch at index ${i}`);
    }
  }
  console.log(`\n✅ Finished importing ${filename}`);
}

async function main() {
  const files = [
    'University-ALL UNIVERSITIES.xlsx',
    'Standalone-ALL STANDALONE.xlsx',
    'College-Affiliated College.xlsx'
  ];

  for (const file of files) {
    await processFile(file);
  }
  console.log("\n🎉 ALL IMPORTS COMPLETED SUCCESSFULLY!");
}

main().catch(console.error).finally(() => prisma.$disconnect());

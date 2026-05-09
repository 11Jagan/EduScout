import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const colleges = [
  { name:"IIT Bombay", slug:"iit-bombay", location:"Mumbai, Maharashtra", state:"Maharashtra", feesPerYear:225000, rating:4.8, type:"IIT" as const, established:1958, naacGrade:"A++", placementPercent:97, avgPackage:2100000, topPackage:28000000, tags:["Top 3 India","STEM","Research"], exam:"JEE_ADVANCED" as const },
  { name:"IIT Delhi", slug:"iit-delhi", location:"New Delhi", state:"Delhi", feesPerYear:220000, rating:4.7, type:"IIT" as const, established:1961, naacGrade:"A++", placementPercent:96, avgPackage:2000000, topPackage:27000000, tags:["Top 5 India","Engineering","Research"], exam:"JEE_ADVANCED" as const },
  { name:"IIT Madras", slug:"iit-madras", location:"Chennai, Tamil Nadu", state:"Tamil Nadu", feesPerYear:218000, rating:4.9, type:"IIT" as const, established:1959, naacGrade:"A++", placementPercent:98, avgPackage:2150000, topPackage:30000000, tags:["#1 NIRF","STEM","Innovation"], exam:"JEE_ADVANCED" as const },
  { name:"IIT Kanpur", slug:"iit-kanpur", location:"Kanpur, Uttar Pradesh", state:"Uttar Pradesh", feesPerYear:215000, rating:4.6, type:"IIT" as const, established:1959, naacGrade:"A++", placementPercent:93, avgPackage:1800000, topPackage:22000000, tags:["Top 5","Research","Innovation"], exam:"JEE_ADVANCED" as const },
  { name:"IIT Kharagpur", slug:"iit-kharagpur", location:"Kharagpur, West Bengal", state:"West Bengal", feesPerYear:210000, rating:4.5, type:"IIT" as const, established:1951, naacGrade:"A++", placementPercent:92, avgPackage:1700000, topPackage:20000000, tags:["Oldest IIT","Large Campus","Research"], exam:"JEE_ADVANCED" as const },
  { name:"AIIMS Delhi", slug:"aiims-delhi", location:"New Delhi", state:"Delhi", feesPerYear:6000, rating:4.9, type:"AIIMS" as const, established:1956, naacGrade:"A++", placementPercent:100, avgPackage:1500000, topPackage:5000000, tags:["#1 Medical","Government","Affordable"], exam:"NEET" as const },
  { name:"NIT Trichy", slug:"nit-trichy", location:"Tiruchirappalli, Tamil Nadu", state:"Tamil Nadu", feesPerYear:150000, rating:4.3, type:"NIT" as const, established:1964, naacGrade:"A+", placementPercent:90, avgPackage:1200000, topPackage:15000000, tags:["Top NIT","South India","Engineering"], exam:"JEE_MAIN" as const },
  { name:"NIT Warangal", slug:"nit-warangal", location:"Warangal, Telangana", state:"Telangana", feesPerYear:145000, rating:4.2, type:"NIT" as const, established:1959, naacGrade:"A+", placementPercent:88, avgPackage:1100000, topPackage:14000000, tags:["Top NIT","Telangana","Engineering"], exam:"JEE_MAIN" as const },
  { name:"BITS Pilani", slug:"bits-pilani", location:"Pilani, Rajasthan", state:"Rajasthan", feesPerYear:500000, rating:4.5, type:"DEEMED" as const, established:1964, naacGrade:"A", placementPercent:95, avgPackage:1600000, topPackage:18000000, tags:["Private Elite","No Reservation","Industry Ties"], exam:"JEE_MAIN" as const },
  { name:"IIM Ahmedabad", slug:"iim-ahmedabad", location:"Ahmedabad, Gujarat", state:"Gujarat", feesPerYear:2300000, rating:4.9, type:"IIM" as const, established:1961, naacGrade:"A++", placementPercent:100, avgPackage:3200000, topPackage:75000000, tags:["#1 MBA","Management","Global"], exam:"JEE_MAIN" as const },
  { name:"VIT Vellore", slug:"vit-vellore", location:"Vellore, Tamil Nadu", state:"Tamil Nadu", feesPerYear:200000, rating:4.0, type:"PRIVATE" as const, established:1984, naacGrade:"A++", placementPercent:85, avgPackage:800000, topPackage:12000000, tags:["Private","South India","Large Campus"], exam:"JEE_MAIN" as const },
  { name:"Delhi University", slug:"delhi-university", location:"New Delhi", state:"Delhi", feesPerYear:50000, rating:4.1, type:"CENTRAL_UNIVERSITY" as const, established:1922, naacGrade:"A+", placementPercent:75, avgPackage:600000, topPackage:5000000, tags:["Central Univ","Arts & Science","Heritage"], exam:"JEE_MAIN" as const },
];

const courseSets: Record<string, {name:string;dur:number;seats:number;fees:number;lvl:"UNDERGRADUATE"|"POSTGRADUATE"|"DOCTORATE"}[]> = {
  IIT: [
    {name:"B.Tech Computer Science",dur:4,seats:120,fees:225000,lvl:"UNDERGRADUATE"},
    {name:"B.Tech Electrical Eng.",dur:4,seats:100,fees:225000,lvl:"UNDERGRADUATE"},
    {name:"M.Tech AI & ML",dur:2,seats:40,fees:225000,lvl:"POSTGRADUATE"},
    {name:"PhD Computer Science",dur:5,seats:20,fees:0,lvl:"DOCTORATE"},
  ],
  AIIMS: [
    {name:"MBBS",dur:5,seats:107,fees:6000,lvl:"UNDERGRADUATE"},
    {name:"MD General Medicine",dur:3,seats:25,fees:6000,lvl:"POSTGRADUATE"},
    {name:"MS General Surgery",dur:3,seats:20,fees:6000,lvl:"POSTGRADUATE"},
  ],
  NIT: [
    {name:"B.Tech CSE",dur:4,seats:180,fees:150000,lvl:"UNDERGRADUATE"},
    {name:"B.Tech ECE",dur:4,seats:150,fees:150000,lvl:"UNDERGRADUATE"},
    {name:"M.Tech Data Science",dur:2,seats:50,fees:150000,lvl:"POSTGRADUATE"},
  ],
  DEEMED: [
    {name:"B.E. Computer Science",dur:4,seats:200,fees:500000,lvl:"UNDERGRADUATE"},
    {name:"B.E. Electronics",dur:4,seats:150,fees:500000,lvl:"UNDERGRADUATE"},
    {name:"M.E. Software Systems",dur:2,seats:60,fees:500000,lvl:"POSTGRADUATE"},
    {name:"MBA",dur:2,seats:80,fees:600000,lvl:"POSTGRADUATE"},
  ],
  IIM: [
    {name:"MBA (PGP)",dur:2,seats:400,fees:2300000,lvl:"POSTGRADUATE"},
    {name:"MBA Food & Agri",dur:2,seats:50,fees:2100000,lvl:"POSTGRADUATE"},
    {name:"PhD Management",dur:4,seats:25,fees:0,lvl:"DOCTORATE"},
  ],
  PRIVATE: [
    {name:"B.Tech CSE",dur:4,seats:500,fees:200000,lvl:"UNDERGRADUATE"},
    {name:"B.Tech ECE",dur:4,seats:350,fees:200000,lvl:"UNDERGRADUATE"},
    {name:"M.Tech CS",dur:2,seats:100,fees:200000,lvl:"POSTGRADUATE"},
  ],
  CENTRAL_UNIVERSITY: [
    {name:"B.A. English (Hons)",dur:3,seats:200,fees:50000,lvl:"UNDERGRADUATE"},
    {name:"B.Sc Physics (Hons)",dur:3,seats:150,fees:50000,lvl:"UNDERGRADUATE"},
    {name:"M.A. Economics",dur:2,seats:80,fees:50000,lvl:"POSTGRADUATE"},
    {name:"PhD History",dur:5,seats:15,fees:30000,lvl:"DOCTORATE"},
  ],
};

const reviews = [
  {author:"Rahul Sharma",batch:2023,rating:4.5,content:"Great faculty and infrastructure. The campus life is amazing and placements are excellent.",course:"B.Tech CSE"},
  {author:"Priya Patel",batch:2022,rating:4.0,content:"Good academic environment but hostel facilities could be better. Overall a good experience.",course:"B.Tech ECE"},
  {author:"Amit Kumar",batch:2024,rating:5.0,content:"Absolutely world-class education. The research opportunities and peer group are unmatched.",course:"M.Tech AI"},
];

const aboutTexts: Record<string, string> = {
  "iit-bombay": "Indian Institute of Technology Bombay is a premier engineering institution known for its cutting-edge research, world-class faculty, and exceptional placement record.",
  "iit-delhi": "IIT Delhi is one of the top engineering institutions in India, recognized globally for its academic excellence and innovation.",
  "iit-madras": "IIT Madras, ranked #1 by NIRF, is a leading research and education hub in science and technology.",
  "iit-kanpur": "IIT Kanpur is renowned for pioneering computer science education in India and strong research programs.",
  "iit-kharagpur": "IIT Kharagpur, the oldest IIT, is known for its vast campus and diverse academic departments.",
  "aiims-delhi": "AIIMS Delhi is India's premier medical institute, offering world-class medical education and healthcare.",
  "nit-trichy": "NIT Trichy is one of the top NITs in India known for its strong engineering programs and placements.",
  "nit-warangal": "NIT Warangal is a leading NIT offering excellent engineering education in southern India.",
  "bits-pilani": "BITS Pilani is a premier private engineering institution known for its flexible academic system and strong industry connections.",
  "iim-ahmedabad": "IIM Ahmedabad is India's top business school, renowned for its MBA program and global alumni network.",
  "vit-vellore": "VIT Vellore is a top private university known for its large campus and diverse student community.",
  "delhi-university": "Delhi University is one of India's oldest central universities offering a wide range of arts, science, and professional programs.",
};

const branches: Record<string, string[]> = {
  JEE_ADVANCED: ["Computer Science","Electrical Engineering","Mechanical Engineering","Civil Engineering"],
  JEE_MAIN: ["Computer Science","Electronics","Mechanical","Information Technology"],
  NEET: ["MBBS","BDS","B.Sc Nursing"],
};

async function main() {
  console.log("🌱 Seeding database...");
  
  // Clear existing data
  await prisma.predictorCutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.collegeInfo.deleteMany();
  await prisma.collegeTag.deleteMany();
  await prisma.college.deleteMany();

  for (const c of colleges) {
    const college = await prisma.college.create({
      data: {
        name: c.name, slug: c.slug, location: c.location, state: c.state,
        feesPerYear: c.feesPerYear, rating: c.rating, type: c.type,
        established: c.established, naacGrade: c.naacGrade,
        placementPercent: c.placementPercent, avgPackage: c.avgPackage,
        topPackage: c.topPackage,
      },
    });

    // Tags
    for (const tag of c.tags) {
      await prisma.collegeTag.create({ data: { collegeId: college.id, tag } });
    }

    // Courses
    const courseKey = c.type === "STATE_UNIVERSITY" ? "CENTRAL_UNIVERSITY" : c.type;
    const courseList = courseSets[courseKey] || courseSets["PRIVATE"];
    for (const cr of courseList) {
      await prisma.course.create({
        data: { collegeId: college.id, name: cr.name, durationYears: cr.dur, seats: cr.seats, feesPerYear: cr.fees || c.feesPerYear, degreeLevel: cr.lvl },
      });
    }

    // Placements (3 years)
    for (const yr of [2022, 2023, 2024]) {
      const mul = yr === 2022 ? 0.9 : yr === 2023 ? 0.95 : 1;
      await prisma.placement.create({
        data: {
          collegeId: college.id, year: yr,
          placementPercent: Math.min(100, +(c.placementPercent * mul).toFixed(1)),
          avgPackage: Math.round(c.avgPackage * mul),
          topPackage: Math.round(c.topPackage * mul),
          medianPackage: Math.round(c.avgPackage * mul * 0.75),
          companiesVisited: Math.round((100 + Math.random() * 200) * mul),
        },
      });
    }

    // Reviews
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          collegeId: college.id, authorName: r.author, batchYear: r.batch,
          rating: r.rating, content: r.content, courseTaken: r.course,
        },
      });
    }

    // College Info
    await prisma.collegeInfo.create({
      data: {
        collegeId: college.id,
        about: aboutTexts[c.slug] || `${c.name} is a prestigious institution in India.`,
        accreditations: c.naacGrade === "A++" ? "NAAC A++, NBA, UGC" : "NAAC " + c.naacGrade + ", UGC",
        campusAreaAcres: 100 + Math.round(Math.random() * 500),
        hostelAvailable: true,
        scholarshipAvailable: c.type !== "PRIVATE",
        websiteUrl: `https://www.${c.slug.replace(/-/g, "")}.ac.in`,
      },
    });

    // Predictor cutoffs
    const examBranches = branches[c.exam] || branches["JEE_MAIN"];
    const baseRank = c.type === "IIT" ? 500 : c.type === "AIIMS" ? 100 : c.type === "NIT" ? 5000 : 10000;
    for (const cat of ["GENERAL", "OBC", "SC"] as const) {
      const catMul = cat === "GENERAL" ? 1 : cat === "OBC" ? 1.5 : 2.5;
      for (let bi = 0; bi < examBranches.length; bi++) {
        const opening = Math.round(baseRank * (bi * 0.5 + 0.2) * catMul);
        const closing = Math.round(baseRank * (bi + 1) * catMul);
        await prisma.predictorCutoff.create({
          data: {
            collegeId: college.id, exam: c.exam, category: cat,
            openingRank: opening, closingRank: closing, year: 2024,
            branch: examBranches[bi],
          },
        });
      }
    }

    console.log(`  ✅ ${c.name}`);
  }

  console.log("\n🎉 Seeding complete! 12 colleges with full data.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

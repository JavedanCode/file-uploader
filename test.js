require("dotenv").config();

const prisma = require("./config/prisma");
const supabase = require("./config/supabase");

async function main() {
  console.log("Testing Prisma...");

  await prisma.$queryRaw`SELECT NOW()`;

  console.log("Prisma connected!");

  console.log("Testing Supabase Storage...");

  const { data, error } = await supabase.storage.listBuckets();

  if (error) throw error;

  console.log(data);

  console.log("Supabase connected!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

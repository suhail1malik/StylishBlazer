// scripts/create-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Creating admin user...\n");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Changed: admin → adminUser
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@looklikestitches.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@looklikestitches.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("✅ Admin user created successfully!\n");
  console.log("📧 Email:", admin.email);
  console.log("👤 Name:", admin.name);
  console.log("🔑 Password: admin123");
  console.log("\n🚀 Login at: http://localhost:3000/admin/login\n");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

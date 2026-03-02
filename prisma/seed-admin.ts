// prisma/seed-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Password hash karo
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin user create/update karo
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@StylishBlazer.com' },
    update: {},
    create: {
      email: 'admin@StylishBlazer.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email: admin@StylishBlazer.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

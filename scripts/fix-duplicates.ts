import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for duplicate invoice numbers...");
  const invoices = await prisma.invoice.findMany({
    select: { id: true, invoiceNumber: true }
  });

  const counts: Record<string, string[]> = {};
  for (const inv of invoices) {
    if (!counts[inv.invoiceNumber]) {
      counts[inv.invoiceNumber] = [];
    }
    counts[inv.invoiceNumber].push(inv.id);
  }

  let fixedCount = 0;
  for (const [num, ids] of Object.entries(counts)) {
    if (ids.length > 1) {
      console.log(`Fixing duplicates for invoice number: ${num}`);
      // Keep the first one, rename others
      for (let i = 1; i < ids.length; i++) {
        const newNum = `${num}-DUP-${i}-${Date.now().toString().slice(-4)}`;
        await prisma.invoice.update({
          where: { id: ids[i] },
          data: { invoiceNumber: newNum }
        });
        console.log(`  Updated ${ids[i]} to ${newNum}`);
        fixedCount++;
      }
    }
  }

  if (fixedCount === 0) {
    console.log("No duplicates found.");
  } else {
    console.log(`Successfully fixed ${fixedCount} duplicate(s).`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

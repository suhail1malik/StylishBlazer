import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/invoices - List all invoices
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(prisma as any).invoice) {
      console.error("PRISMA RECOVERY: 'invoice' model missing on prisma instance. Keys:", Object.keys(prisma).filter(k => !k.startsWith('_')));
      return NextResponse.json({ error: "Database Model Mismatch" }, { status: 500 });
    }

    const invoices = await (prisma as any).invoice.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("List Invoices Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/admin/invoices - Save a new invoice
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!(prisma as any).invoice) {
      return NextResponse.json({ error: "Database Model Mismatch" }, { status: 500 });
    }

    const invoice = await (prisma as any).invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        date: new Date(data.date),
        brandName: data.brandName,
        brandGST: data.brandGST,
        clientName: data.clientName,
        clientContact: data.clientContact,
        clientEmail: data.clientEmail,
        clientAddress: data.clientAddress,
        clientGST: data.clientGST,
        items: data.items,
        subtotal: data.subtotal,
        taxType: data.taxType,
        cgstRate: data.cgstRate || 9,
        sgstRate: data.sgstRate || 9,
        cgst: data.cgst,
        sgst: data.sgst,
        total: data.total,
        notes: data.notes,
      }
    });

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("Save Invoice Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Invoice number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

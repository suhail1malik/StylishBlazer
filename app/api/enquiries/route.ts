import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - fetch all enquiries (admin)
export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - submit new enquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, productName, message, source } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone and message are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        productName: productName || null,
        message,
        source: source || "contact",
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

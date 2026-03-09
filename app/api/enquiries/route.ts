import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 IPs
});

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  message: z.string().max(2000, "Message is too long").optional(),
  source: z.string().optional(),
  productName: z.string().optional().nullable(),
  productImage: z.string().url().optional().nullable().or(z.literal("")),
  productUrl: z.string().url().optional().nullable().or(z.literal("")),
});

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

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (Max 5 req per 15 min per IP)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      await limiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Input Validation via Zod
    const validationResult = enquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }
    const validatedData = validationResult.data;

    // 3. Database mein save karo
    const enquiry = await prisma.enquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone,
        message: validatedData.message || "",
        source: validatedData.source || "general",
        productName: validatedData.productName || null,
        productImage: validatedData.productImage || null,
        productUrl: validatedData.productUrl || null,
      },
    });

    // 4. Admin ko notify karo (Email)
    const { name, email, phone, message, source, productName, productImage, productUrl } = validatedData;

    // 2. Admin ko notify karo (Email)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Stylish Blazer Notifications" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `New Enquiry from ${name} - ${source === 'product' ? productName : 'General'}`,
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #059669; border-bottom: 2px solid #ecfdf5; padding-bottom: 10px;">New Enquiry Received</h2>
              
              <p><strong>Customer Details:</strong></p>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email || 'Not provided'}</li>
                <li><strong>Phone:</strong> ${phone}</li>
              </ul>

              <p><strong>Message:</strong></p>
              <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin: 10px 0;">
                ${(message || "").replace(/\n/g, '<br>')}
              </div>

              ${source === 'product' ? `
                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                  <p><strong>Product Interest:</strong></p>
                  <div style="display: flex; align-items: center; gap: 15px;">
                    ${productImage ? `<img src="${productImage}" width="80" style="border-radius: 5px;" alt="product"/>` : ''}
                    <div>
                      <p style="margin: 0; font-weight: bold;">${productName}</p>
                      <p style="margin: 0;"><a href="${productUrl}" style="color: #059669; text-decoration: none;">View Product Page</a></p>
                    </div>
                  </div>
                </div>
              ` : ''}

              <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                Source: ${source} • Sent on: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

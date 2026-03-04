import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

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
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      source,
      productName,
      productImage,
      productUrl
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // 1. Database mein save karo
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        message: message || "",
        source: source || "general",
        productName: productName || null,
        productImage: productImage || null,
        productUrl: productUrl || null,
      },
    });

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
                <li><strong>Email:</strong> ${email}</li>
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

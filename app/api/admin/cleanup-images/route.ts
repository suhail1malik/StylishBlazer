import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // We use the Cloudinary Admin API to find files in the temp folder and delete them
    const { resources } = await cloudinary.search
      .expression('folder:looklikestitches/temp')
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    if (resources && resources.length > 0) {
      const publicIds = resources.map((r: any) => r.public_id);
      await cloudinary.api.delete_resources(publicIds);
    }

    return NextResponse.json({
      success: true,
      deletedCount: resources?.length || 0
    });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: error.message || "Failed to cleanup temp images" }, { status: 500 });
  }
}

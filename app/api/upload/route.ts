import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "../../../lib/utils";

// In a real app, this would handle file uploads to a storage service
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }
    
    // Mock response - in a real app, files would be uploaded to storage
    const uploadedFiles = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      
      return {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: isImage ? "image" : "file",
        url: `/api/files/${uuidv4()}`, // Mock URL
        mimeType: file.type,
      };
    });
    
    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
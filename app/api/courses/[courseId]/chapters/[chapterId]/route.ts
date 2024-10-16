import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string; chapterId: string } }
) {
 try {
  const { userId } = auth();
  if (!userId) {
   return new NextResponse(null, { status: 401 });
  }
  const { courseId, chapterId } = params;
  const courseOwner = await db.course.findUnique({
   where: { id: courseId, userId },
  });
  if (!courseOwner) {
   return new NextResponse(null, { status: 401 });
  }

  const { isPublished, ...values } = await req.json();
  const chapter = await db.chapter.update({
   where: { id: chapterId, courseId },
   data: values,
  });

  // TODO : Handle Video Upload
  if (!chapter) {
   return new NextResponse("Not Found", { status: 404 });
  }
  return NextResponse.json(chapter);
 } catch (error) {
  console.log("[CHAPTER]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

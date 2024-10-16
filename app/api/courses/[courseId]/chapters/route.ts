import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = auth();
  const { title } = await req.json();
  const { courseId } = params;
  if (!userId) {
   return new NextResponse("Unauthorized", { status: 401 });
  }

  const courseOwner = await db.course.findUnique({
   where: {
    id: courseId,
    userId,
   },
   include: {
    chapters: {
     orderBy: {
      position: "asc",
     },
    },
   },
  });
  if (!courseOwner) {
   return new NextResponse("Unauthorized", { status: 401 });
  }

  const chapter = await db.chapter.create({
   data: {
    title,
    position: courseOwner.chapters.length + 1,
    courseId,
   },
  });
  return NextResponse.json(chapter);
 } catch (error) {
  console.log("[CHAPTERS]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

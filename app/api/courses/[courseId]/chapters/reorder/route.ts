import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = auth();
  const { courseId } = params;
  if (!userId) {
   return new NextResponse("Unauthorized", { status: 401 });
  }

  const courseOwner = await db.course.findUnique({
   where: {
    id: courseId,
    userId,
   },
  });
  if (!courseOwner) {
   return new NextResponse("Unauthorized", { status: 401 });
  }
  const { list }: { list: Chapter[] } = await req.json();
  await Promise.all(
   list.map(async ({ id, position }) => {
    return db.chapter.update({
     where: {
      id,
     },
     data: {
      position,
     },
    });
   })
  );
  return NextResponse.json("Success", { status: 200 });
 } catch (error) {
  console.log("[REORDER CHAPTERS]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

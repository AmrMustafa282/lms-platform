import { isAuthorized } from "@/app/api/utils/is-authorized";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
 req: Request,
 params: { params: { courseId: string; chapterId: string } }
) {
 try {
  const { userId } = isAuthorized();

  const { courseId, chapterId } = params.params;
  const { isCompleted } = await req.json();

  const userPorogress = await db.userProgress.upsert({
   where: {
    userId_chapterId: {
     userId,
     chapterId,
    },
   },
   update: {
    isCompleted,
   },
   create: {
    userId,
    chapterId,
    isCompleted,
   },
  });
   return NextResponse.json(userPorogress);
 } catch (error) {
  console.log("[CHAPTER_ID_PROGRESS]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

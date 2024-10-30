import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { db } from "@/lib/db";

import { Chapter } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = isAuthorized();
  const { courseId } = params;

  isCourseOwner({courseId, userId });
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

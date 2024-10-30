import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
 req: Request,
 { params }: { params: { courseId: string; attachmentId: string } }
) {
 try {
  const { userId } = isAuthorized();
  const { courseId } = params;
  isCourseOwner({courseId, userId });

  await db.attachment.delete({
   where: {
    id: params.attachmentId,
    courseId: params.courseId,
   },
  });

  return new NextResponse("Attachment deleted successfully.");
 } catch (error) {
  console.log("[COURSE_ID_ATTACHMENTS]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

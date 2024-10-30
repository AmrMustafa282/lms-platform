import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { revalidatePublishment } from "@/app/api/utils/revalidate-publishment";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {

try {
  const { userId } = isAuthorized();
  const { courseId, chapterId } = params;
  if(!courseId || !chapterId) {
    return new NextResponse("courseID or chapterID is missing", { status: 404 });
  }
isCourseOwner({ courseId, userId });

const unPublishedChapter = await db.chapter.update({
  where: {
    id: chapterId,
  },
  data: {
    isPublished: false,
  },
});

revalidatePublishment(courseId);

  return NextResponse.json(unPublishedChapter);
} catch (error) {
  console.log("[CHAPTER_ID_PUBLISH_PATCH]", error);
  return new NextResponse("Internal Error", { status: 500 });
}
}

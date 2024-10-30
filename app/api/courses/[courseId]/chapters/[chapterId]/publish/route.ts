import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
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
const chapter = await db.chapter.findUnique({
  where: {
    id: chapterId,
    courseId
  },
});
const muxData = await db.muxData.findUnique({
  where: {
    chapterId,
  },
});

if (!chapter || !muxData || !chapter.title ||!chapter.description || !chapter.videoUrl) {
  return new NextResponse("Missing required fields", { status: 400 });
}

const publishedChapter = await db.chapter.update({
  where: {
    id: chapterId,
  },
  data: {
    isPublished: true,
  },
});
  return NextResponse.json(publishedChapter);
} catch (error) {
  console.log("[CHAPTER_ID_PUBLISH_PATCH]", error);
  return new NextResponse("Internal Error", { status: 500 });
}
}

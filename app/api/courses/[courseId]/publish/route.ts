import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {

try {
  const { userId } = isAuthorized();
  const { courseId } = params;
  if(!courseId ) {
    return new NextResponse("courseID is missing", { status: 404 });
  }
isCourseOwner({ courseId, userId });
const course = await db.course.findUnique({
  where: {
    id: courseId,
    userId
  },
  include:{
    chapters:{
      include:{
        muxData:true
      }
    }
  }
});

if (!course) {
  return new NextResponse("Course not found", { status: 404 });
}
const hasPublishedChapters = course.chapters.some((chapter) => chapter.isPublished);


if (!course.title || !course.description || !course.imageUrl || !course.price || !course.categoryId || !hasPublishedChapters) {
  return new NextResponse("Missing required fields", { status: 400 });
}

await db.course.update({
  where: {
    id: courseId,
    userId
  },
  data: {
    isPublished: true,
  },
});
  return NextResponse.json("Course published successfully");
} catch (error) {
  console.log("[COURSE_ID_PUBLISH_PATCH]", error);
  return new NextResponse("Internal Error", { status: 500 });
}
}

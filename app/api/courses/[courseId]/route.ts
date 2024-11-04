import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAuthorized } from "../../utils/is-authorized";
import { isCourseOwner } from "../../utils/is-course-owner";
import { revalidatePublishment } from "../../utils/revalidate-publishment";

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = auth();
  if (!userId) {
   return new NextResponse("Unauthorized", { status: 401 });
  }

  const course = await db.course.update({
   where: {
    id: params.courseId,
   },
   data: await req.json(),
  });
  if (!course) {
   return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(course);
 } catch (error) {
  console.log("[COURSES]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

export async function DELETE(
  req: Request,{params}: {params: {courseId: string;}}
){
  try {
    const {userId}  = isAuthorized()
    const {courseId} = params;
    if(!courseId ){
      return new NextResponse("chapterId or courseId is missing", {status: 404});
    }
    isCourseOwner({ courseId, userId  });
    const course = await db.course.findUnique({
      where: {id: courseId, userId},
    })
    if(!course){
      return new NextResponse("Course not found", {status: 404});
    }
    
    // TODO: Delete all chapters, muxData, and muxAssets
    // if(chapter.videoUrl){
    //   const muxData = await db.muxData.findFirst({
    //     where: {chapterId},
    //   });
    //   if(muxData){
    //     await video.assets.delete(muxData.assetId);
    //     await db.muxData.delete({where: {id: muxData.id}});
    //   }
    // }

    await db.course.delete({where: {id: courseId}});

    revalidatePublishment(courseId);

    return new NextResponse("Course deleted successfully", {status: 200});

  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

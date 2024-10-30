import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {  isCourseOwner } from "@/app/api/utils/is-course-owner";
import { isAuthorized } from "@/app/api/utils/is-authorized";

const { video } = new Mux({
 tokenId: process.env.MUX_TOKEN_ID,
 tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string; chapterId: string } }
) {
 try {
  const {userId}  = isAuthorized()
  const { courseId, chapterId } = params;
  isCourseOwner({ courseId, userId });
  const { isPublished, ...values } = await req.json();
  const chapter = await db.chapter.update({
   where: { id: chapterId, courseId },
   data: values,
  });

  if (values.videoUrl) {
   const existingMuxData = await db.muxData.findFirst({
    where: { chapterId },
   });
   if (existingMuxData) {
    await video.assets.delete(existingMuxData.assetId);
    await db.muxData.delete({ where: { id: existingMuxData.id } });
   }
   const asset = await video.assets.create({
    input: values.videoUrl,
    playback_policy: ["public"],
    test: false,
   });
   await db.muxData.create({
    data: {
     assetId: asset.id,
     chapterId,
     playbackId: asset.playback_ids?.[0]?.id,
    },
   });
  }

  if (!chapter) {
   return new NextResponse("Not Found", { status: 404 });
  }
  return NextResponse.json(chapter);
 } catch (error) {
  console.log("[CHAPTER_ID_PATCH]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}

export async function DELETE(
  req: Request,{params}: {params: {courseId: string; chapterId: string}}
){
  try {
    const {userId}  = isAuthorized()
    const {courseId, chapterId} = params;
    if(!courseId || !chapterId){
      return new NextResponse("chapterId or courseId is missing", {status: 404});
    }
    isCourseOwner({ courseId, userId  });
    const chapter = await db.chapter.findUnique({
      where: {id: chapterId, courseId},
    })
    if(!chapter){
      return new NextResponse("Chapter not found", {status: 404});
    }
    if(chapter.videoUrl){
      const muxData = await db.muxData.findFirst({
        where: {chapterId},
      });
      if(muxData){
        await video.assets.delete(muxData.assetId);
        await db.muxData.delete({where: {id: muxData.id}});
      }
    }
    await db.chapter.delete({where: {id: chapterId}});

    const pushlishedChaptersInCourse = await db.chapter.findMany({
      where: {courseId, isPublished: true},
     });
    if(!pushlishedChaptersInCourse.length){
      await db.course.update({
        where: {id: courseId},
        data: {isPublished: false},
      });
    }

    return new NextResponse("Chapter deleted successfully", {status: 200});

  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

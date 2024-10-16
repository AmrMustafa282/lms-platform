"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Video, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";
import FileUpload from "../../../_components/file-upload";

const formSchema = z.object({
 videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
 initialData: Chapter & { muxData?: MuxData | null };
 courseId: string;
 chapterId: string;
}

export const ChapterVideoForm = ({
 initialData,
 courseId,
 chapterId,
}: ChapterVideoFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
   toast.success("Chapter video updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course video
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing && <>Cancel</>}
     {!isEditing && !initialData.videoUrl && (
      <>
       <PlusCircle className="h-4 w-4 mr-2" />
       Add a video
      </>
     )}
     {!isEditing && initialData.videoUrl && (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit video
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <div
     className={cn(
      "text-sm mt-2",
      !initialData.videoUrl && "text-slate-500 italic"
     )}
    >
     {initialData.videoUrl ? (
      <div className="relative aspect-video mt-2">
       <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
      </div>
     ) : (
      <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
       <Video className="h-10 w-10 text-slate-500" />
      </div>
     )}
    </div>
   ) : (
    <div className="h-60 flex items-center justify-around flex-col">
     <FileUpload
      endpoint="chapterVideo"
      onChange={(url) => {
       if (url) {
        onSubmit({ videoUrl: url });
       }
      }}
     />
     <div className=" text-xs text-muted-foreground mt-4">
      Upload this chapter&apos;s video. Max size 512MB.
     </div>
    </div>
   )}
   {initialData.videoUrl && !isEditing && (
    <div className="text-xs text-muted-foreground mt-2">
     Video can take a few miniutes to process. Refresh the page if video does
     not appear.
    </div>
   )}
  </div>
 );
};

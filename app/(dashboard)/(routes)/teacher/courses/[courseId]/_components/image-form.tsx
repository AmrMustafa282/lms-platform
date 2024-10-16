"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "./file-upload";

const formSchema = z.object({
 imageUrl: z.string().min(1, { message: "Image is required" }),
});

interface ImageFormProps {
 initialData: Course;
 courseId: string;
}

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}`, values);
   toast.success("Course image updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course image
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing && <>Cancel</>}
     {!isEditing && !initialData.imageUrl && (
      <>
       <PlusCircle className="h-4 w-4 mr-2" />
       Add an image
      </>
     )}
     {!isEditing && initialData.imageUrl && (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit image
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <div
     className={cn(
      "text-sm mt-2",
      !initialData.imageUrl && "text-slate-500 italic"
     )}
    >
     {initialData.imageUrl ? (
      <div className="relative aspect-video mt-2">
       <Image
        alt="upload"
        fill
        className="object-cover rounded-md"
        src={initialData.imageUrl}
       />
      </div>
     ) : (
      <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
       <ImageIcon className="h-10 w-10 text-slate-500" />
      </div>
     )}
    </div>
   ) : (
    <div className="h-60 flex items-center justify-around flex-col">
     <FileUpload
      endpoint="courseImage"
      onChange={(url) => {
       if (url) {
        onSubmit({ imageUrl: url });
       }
      }}
     />
     <div className=" text-xs text-muted-foreground mt-4">
      16:9 aspect ratio recommended
     </div>
    </div>
   )}
  </div>
 );
};

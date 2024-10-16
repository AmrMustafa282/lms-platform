"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "./file-upload";

const formSchema = z.object({
 url: z.string().min(1),
});

interface AttachmentFormProps {
 initialData: Course & { attachments: Attachment[] };
 courseId: string;
}

export const AttachmentForm = ({
 initialData,
 courseId,
}: AttachmentFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const [deletingId, setDeleteingId] = useState<string | null>(null);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.post(`/api/courses/${courseId}/attachments`, values);
   toast.success("Course attachments updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 const onDelete = async (id: string) => {
  try {
   setDeleteingId(id);
   await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
   toast.success("Attachment deleted successfully.");
   router.refresh();
  } catch (error) {
   toast.error("An error occurred, please try again.");
  } finally {
   setDeleteingId(null);
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course attachments
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing && <>Cancel</>}
     {!isEditing && (
      <>
       <PlusCircle className="h-4 w-4 mr-2" />
       Add an file
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
     {initialData.attachments.length > 0 ? (
      <>
       <div className="space-y-2">
        {initialData.attachments.map((attachment) => (
         <div
          key={attachment.id}
          className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
         >
          <File className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="text-xs line-clamp-1 mr-2">{attachment.name}</p>
          {deletingId === attachment.id ? (
           <div>
            <Loader2 className="h-4 w-4 animate-spin" />
           </div>
          ) : (
           <button
            onClick={() => onDelete(attachment.id)}
            className="ml-auto hover:opacity-75 transition"
           >
            <X className="h-4 w-4 " />
           </button>
          )}
         </div>
        ))}
       </div>
      </>
     ) : (
      <p className="text-sm mt-2 text-slate-500 italic">
       No Attachments added yet.
      </p>
     )}
    </div>
   ) : (
    <div className="h-60 flex items-center justify-around flex-col">
     <FileUpload
      endpoint="courseAttachment"
      onChange={(url) => {
       if (url) {
        onSubmit({ url });
       }
      }}
     />
     <div className=" text-xs text-muted-foreground mt-4">
      Add anything your students might need to complete the course.
     </div>
    </div>
   )}
  </div>
 );
};

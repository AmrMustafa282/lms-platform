"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

const formSchema = z.object({
 description: z.string().min(5),
});

interface ChapterDescriptionFormProps {
 initialData: Chapter;
 courseId: string;
 chapterId: string;
}

export const ChapterDescriptionForm = ({
 initialData,
 courseId,
 chapterId,
}: ChapterDescriptionFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };
 // 1. Define your form.
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   description: initialData?.description || "",
  },
 });
 const { isSubmitting, isValid } = form.formState;

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
   toast.success("Chapter description updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Chapter description
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing ? (
      <>Cancel</>
     ) : (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit description
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <div
     className={cn(
      "text-sm mt-2",
      !initialData.description && "text-slate-500 italic"
     )}
    >
     {initialData.description ? (
      <Preview value={initialData.description} />
     ) : (
      "No description provided."
     )}
    </div>
   ) : (
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <FormField
       control={form.control}
       name="description"
       render={({ field }) => (
        <FormItem>
         <FormControl>
          <Editor {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <div className="flex items-center gap-x-2">
       <Button disabled={isSubmitting || !isValid} type="submit">
        Save
       </Button>
      </div>
     </form>
    </Form>
   )}
  </div>
 );
};

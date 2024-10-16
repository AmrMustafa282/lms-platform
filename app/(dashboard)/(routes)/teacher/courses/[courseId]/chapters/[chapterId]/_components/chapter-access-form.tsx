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
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { IconBadge } from "@/components/icon-badge";

const formSchema = z.object({
 isFree: z.boolean().default(false),
});

interface ChapterAccessFormProps {
 initialData: Chapter;
 courseId: string;
 chapterId: string;
}

export const ChapterAccessForm = ({
 initialData,
 courseId,
 chapterId,
}: ChapterAccessFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };
 // 1. Define your form.
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   isFree: !!initialData?.isFree,
  },
 });
 const { isSubmitting, isValid } = form.formState;

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
   toast.success("Chapter accessability updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Chapter accessability
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing ? (
      <>Cancel</>
     ) : (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit accessability
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <div
     className={cn(
      "text-sm mt-2",
      !initialData.isFree && "text-slate-500 italic"
     )}
    >
     {initialData.isFree ? (
      <div className="flex items-center gap-2">
       <IconBadge icon={Eye} variant={"success"} size={"md"} />
       <p>This chapter is free for preview.</p>
      </div>
     ) : (
      <div className="flex items-center gap-2">
       <IconBadge icon={EyeOff} variant={"failure"} size={"md"} />
       <p>This chapter is not free.</p>
      </div>
     )}
    </div>
   ) : (
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <FormField
       control={form.control}
       name="isFree"
       render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
         <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
         </FormControl>
         <div className="space-y-1 leading-none">
          <FormDescription>
           Check this box if you want to make this chapter free for preview
          </FormDescription>
         </div>
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

"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormMessage,
} from "@/components/ui/form";

import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

const formSchema = z.object({
 title: z.string().min(1, { message: "Title is required" }),
});

interface ChaptersFormProps {
 initialData: Course & { chapters: Chapter[] };
 courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
 const [isCreateing, setIsCreating] = useState(false);
 const [isUpdating, setIsUpdating] = useState(false);
 const router = useRouter();
 const toggleCreating = () => {
  setIsCreating((prev) => !prev);
 };
 // 1. Define your form.
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   title: "",
  },
 });
 const { isSubmitting, isValid } = form.formState;

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.post(`/api/courses/${courseId}/chapters`, values);
   toast.success("Chapter created successfully.");
   toggleCreating();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };

 const onReorder = async (updateData: { id: string; position: number }[]) => {
  try {
   setIsUpdating(true);
   await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
    list: updateData,
   });
   toast.success("Chapters reordered successfully.");
   router.refresh();
  } catch (error) {
   toast.error("An error occurred, please try again.");
  } finally {
   setIsUpdating(false);
  }
 };
 const onEdit = (id: string) => {
  router.push(`/teacher/courses/${courseId}/chapters/${id}`);
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
   {isUpdating && (
    <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
     <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
    </div>
   )}
   <div className="font-medium flex items-center justify-between">
    Course chapters
    <Button variant={"ghost"} onClick={toggleCreating}>
     {isCreateing ? (
      <>Cancel</>
     ) : (
      <>
       <PlusCircle className="h-4 w-4 mr-2" />
       Add a chapter
      </>
     )}
    </Button>
   </div>
   {isCreateing && (
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <FormField
       control={form.control}
       name="title"
       render={({ field }) => (
        <FormItem>
         <FormControl>
          <Input
           disabled={isSubmitting}
           placeholder="e.g. 'Introduction to the course'"
           {...field}
          />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <Button disabled={isSubmitting || !isValid} type="submit">
       Create
      </Button>
     </form>
    </Form>
   )}
   {!isCreateing && (
    <div
     className={cn(
      "text-sm mt-2",
      !initialData.chapters.length && "text-slate-500 italic"
     )}
    >
     {!initialData.chapters.length && "No chapters added yet."}
     <ChaptersList
      onEdit={onEdit}
      onReorder={onReorder}
      items={initialData.chapters || []}
     />
    </div>
   )}
   {!isCreateing && (
    <p className="text-xs text-muted-foreground mt-4">
     Drag and drop to reorder the chapters
    </p>
   )}
  </div>
 );
};
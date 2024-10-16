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

import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";

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
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
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
     {/* TODO: Add a list of chapters */}
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

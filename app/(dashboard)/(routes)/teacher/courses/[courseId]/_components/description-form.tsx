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
import { Course } from "@prisma/client";

const formSchema = z.object({
 description: z.string().min(10, { message: "Description is required" }),
});

interface DescriptionFormProps {
 initialData: Course;
 courseId: string;
}

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
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
   await axios.patch(`/api/courses/${courseId}`, values);
   toast.success("Course description updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course description
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
    <p
     className={cn(
      "text-sm mt-2",
      !initialData.description && "text-slate-500 italic"
     )}
    >
     {initialData.description
      ? initialData.description
      : "No description provided."}
    </p>
   ) : (
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <FormField
       control={form.control}
       name="description"
       render={({ field }) => (
        <FormItem>
         <FormControl>
          <Textarea
           disabled={isSubmitting}
           placeholder="e.g. 'Learn how to build a full-stack application'"
           {...field}
          />
         </FormControl>
         <FormDescription>
          This is your course description. Be as detailed as possible.
         </FormDescription>
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



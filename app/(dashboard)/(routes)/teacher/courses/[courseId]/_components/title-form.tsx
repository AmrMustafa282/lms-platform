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
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
 title: z.string().min(10, { message: "Title is required" }),
});

interface TitleFormProps {
 initialData: {
  title: string;
  // description: string;
  // imageUrl: string;
  // price: number;
  // categoryId: string;
 };
 courseId: string;
}

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };
 // 1. Define your form.
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: initialData,
 });
 const { isSubmitting, isValid } = form.formState;

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}`, values);
   toast.success("Course title updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course title
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing ? (
      <>Cancel</>
     ) : (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit title
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <p>{initialData.title}</p>
   ) : (
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
           placeholder="e.g. 'Advanced web development'"
           {...field}
          />
         </FormControl>
         <FormDescription>
          This is your course title, it should be descriptive of your course
          content.
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

export default TitleForm;

{
 /* <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
       control={form.control}
       name="title"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Title</FormLabel>
         <FormControl>
          <Input placeholder="shadcn" {...field} />
         </FormControl>
         <FormDescription>This is your public display name.</FormDescription>
         <FormMessage />
        </FormItem>
       )}
      />
      <Button type="submit">Submit</Button>
     </form>
    </Form> */
}

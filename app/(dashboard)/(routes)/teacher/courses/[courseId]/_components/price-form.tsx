"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
 price: z.coerce.number(),
});

interface PriceFormProps {
 initialData: Course;
 courseId: string;
}

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
 const [isEditing, setIsEditing] = useState(false);
 const router = useRouter();
 const toggleEditing = () => {
  setIsEditing((prev) => !prev);
 };
 // 1. Define your form.
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   price: initialData?.price || undefined,
  },
 });
 const { isSubmitting, isValid } = form.formState;

 // 2. Define a submit handler.
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
   await axios.patch(`/api/courses/${courseId}`, values);
   toast.success("Course price updated successfully.");
   toggleEditing();
   router.refresh();
  } catch {
   toast.error("An error occurred, please try again.");
  }
 };
 return (
  <div className="mt-6 border bg-slate-100 rounded-md p-4">
   <div className="font-medium flex items-center justify-between">
    Course price
    <Button variant={"ghost"} onClick={toggleEditing}>
     {isEditing ? (
      <>Cancel</>
     ) : (
      <>
       <Pencil className="h-4 w-4 mr-2" />
       Edit price
      </>
     )}
    </Button>
   </div>
   {!isEditing ? (
    <p
     className={cn(
      "text-sm mt-2",
      !initialData.price && "text-slate-500 italic"
     )}
    >
     {initialData.price ? formatPrice(initialData?.price) : "No price set"}
    </p>
   ) : (
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <FormField
       control={form.control}
       name="price"
       render={({ field }) => (
        <FormItem>
         <FormControl>
          <Input
           disabled={isSubmitting}
           type="number"
           step={"0.01"}
           placeholder="Set a price for your course"
           {...field}
          />
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
